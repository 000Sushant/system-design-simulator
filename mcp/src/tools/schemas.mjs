import { z } from 'zod';

export const id = z.string().min(1).max(128).regex(/\S/);
export const position = z.number().min(-10_000).max(10_000);
export const dimension = z.number().positive().max(2_000);
export const fontWeight = z.enum(['normal', 'bold']);
export const simulationMode = z.enum(['idle', 'running', 'paused']);
export const item = z.looseObject({ id });
export const node = z.looseObject({ id, name: z.string(), ports: z.array(item) });
export const configValue = z.object({ key: z.literal('requestRate'), value: z.number() });

export const canvasIdSchema = id;
