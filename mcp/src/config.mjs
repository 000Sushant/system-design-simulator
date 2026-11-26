export const OPERATOR_CODE_ENV = 'SIMULATOR_MCP_OPERATOR_PAIRING_CODE';

// Read the operator pairing code once and remove it from the environment so child processes cannot inherit it.
export function takeOperatorCode(env = process.env) {
  const code = env[OPERATOR_CODE_ENV];
  delete env[OPERATOR_CODE_ENV];
  return code;
}
