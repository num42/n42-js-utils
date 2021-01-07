const SHOULD_LOG = true;

export function log(...args) {
  if (!SHOULD_LOG) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('[LOG]', `[${new Date().toISOString()}]`, ...args);
}

export function warn(...args) {
  if (!SHOULD_LOG) {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn('[WARNING]', `[${new Date().toISOString()}]`, ...args);
}

export function error(...args) {
  // eslint-disable-next-line no-console
  console.error('[Error]', `[${new Date().toISOString()}]`, ...args);
}

export function info(...args) {
  console.info(...args); // eslint-disable-line no-console
  return false;
}

export default {
  info,
  log,
  warn,
  error,
};
