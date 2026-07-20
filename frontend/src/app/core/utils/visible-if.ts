
export type ConfigRecord = Record<string, unknown>;

const NEGATION = /^!\s*config\.([A-Za-z0-9_$]+)$/;
const TRUTHY = /^config\.([A-Za-z0-9_$]+)$/;
const COMPARISON = /^config\.([A-Za-z0-9_$]+)\s*(===|!==|==|!=)\s*(.+)$/;

export function evaluateVisibleIf(expression: string | undefined, config: ConfigRecord): boolean {
  if (!expression || !expression.trim()) return true;
  try {
    return evalOr(expression, config);
  } catch {
    return true;
  }
}

function evalOr(expr: string, config: ConfigRecord): boolean {
  return splitTopLevel(expr, '||').some((part) => evalAnd(part, config));
}

function evalAnd(expr: string, config: ConfigRecord): boolean {
  return splitTopLevel(expr, '&&').every((part) => evalAtom(part.trim(), config));
}

function evalAtom(atom: string, config: ConfigRecord): boolean {
  const negation = NEGATION.exec(atom);
  if (negation) return !config[negation[1]];

  const comparison = COMPARISON.exec(atom);
  if (comparison) {
    const [, key, operator, rawLiteral] = comparison;
    const equal = config[key] === parseLiteral(rawLiteral.trim());
    return operator === '===' || operator === '==' ? equal : !equal;
  }

  const truthy = TRUTHY.exec(atom);
  if (truthy) return !!config[truthy[1]];

  throw new Error(`Unsupported visibleIf atom: "${atom}"`);
}

function parseLiteral(token: string): unknown {
  const quoted =
    (token.startsWith("'") && token.endsWith("'")) ||
    (token.startsWith('"') && token.endsWith('"'));
  if (quoted) return token.slice(1, -1);

  switch (token) {
    case 'true':
      return true;
    case 'false':
      return false;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
  }

  const num = Number(token);
  if (token !== '' && !Number.isNaN(num)) return num;

  throw new Error(`Unsupported visibleIf literal: "${token}"`);
}

function splitTopLevel(expr: string, operator: '||' | '&&'): string[] {
  const parts: string[] = [];
  let quote: "'" | '"' | null = null;
  let start = 0;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === operator[0] && expr[i + 1] === operator[1]) {
      parts.push(expr.slice(start, i));
      i++;
      start = i + 1;
    }
  }
  parts.push(expr.slice(start));
  return parts;
}
