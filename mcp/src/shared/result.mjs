// Result envelope shared by the relay and the MCP server: { ok, data } or { ok, error: { code, message } }.

export function failure(code, message) {
  return { ok: false, error: { code, message } };
}

export function success(data) {
  return { ok: true, data };
}

export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
