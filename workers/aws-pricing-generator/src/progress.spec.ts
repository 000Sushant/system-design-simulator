import { describe, it, expect } from 'vitest';
import { getFailureQueue, updateFailureQueue, KV_FAILURE_QUEUE_KEY } from './progress';
import { Env } from './types';

class FakeKV {
  store = new Map<string, string>();
  puts = 0;
  async get(key: string): Promise<string | null> {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  async put(key: string, value: string): Promise<void> {
    this.puts++;
    this.store.set(key, value);
  }
}

function makeEnv(): { env: Env; kv: FakeKV } {
  const kv = new FakeKV();
  const env = { AWS_PRICING_KV: kv } as unknown as Env;
  return { env, kv };
}

describe('failure queue', () => {
  it('is empty by default', async () => {
    const { env } = makeEnv();
    expect(await getFailureQueue(env)).toEqual([]);
  });

  it('adds a region and persists it', async () => {
    const { env, kv } = makeEnv();
    const queue = await updateFailureQueue(env, { add: 'sa-east-1' });
    expect(queue).toEqual(['sa-east-1']);
    expect(JSON.parse(kv.store.get(KV_FAILURE_QUEUE_KEY)!)).toEqual(['sa-east-1']);
  });

  it('never queues the same region twice, and skips the KV write when unchanged', async () => {
    const { env, kv } = makeEnv();
    await updateFailureQueue(env, { add: 'sa-east-1' });
    const putsAfterFirst = kv.puts;
    const queue = await updateFailureQueue(env, { add: 'sa-east-1' });
    expect(queue).toEqual(['sa-east-1']);
    expect(kv.puts).toBe(putsAfterFirst);
  });

  it('removes a region on clean rebuild and leaves others queued', async () => {
    const { env } = makeEnv();
    await updateFailureQueue(env, { add: 'sa-east-1' });
    await updateFailureQueue(env, { add: 'eu-south-2' });
    const queue = await updateFailureQueue(env, { remove: 'sa-east-1' });
    expect(queue).toEqual(['eu-south-2']);
  });

  it('removing a region that is not queued is a no-op', async () => {
    const { env, kv } = makeEnv();
    await updateFailureQueue(env, { add: 'sa-east-1' });
    const putsAfterFirst = kv.puts;
    const queue = await updateFailureQueue(env, { remove: 'us-east-1' });
    expect(queue).toEqual(['sa-east-1']);
    expect(kv.puts).toBe(putsAfterFirst);
  });
});
