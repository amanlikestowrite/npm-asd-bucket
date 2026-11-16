const TYPES = new Set(['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']);
export function formatCommit({ type, scope, description, breaking = false }) {
  if (!TYPES.has(type)) throw new TypeError(`Unsupported Conventional Commit type: ${type}`);
  const clean = String(description ?? '').trim().replace(/^[.\s]+|[.\s]+$/g, '');
  if (!clean) throw new TypeError('Commit description cannot be empty.');
  if (/[\r\n]/.test(clean)) throw new TypeError('Commit description must be a single line.');
  const safeScope = scope ? String(scope).trim().replace(/[()\r\n]/g, '').toLowerCase() : '';
  return `${type}${safeScope ? `(${safeScope})` : ''}${breaking ? '!' : ''}: ${clean}`;
}
export function validateCommitMessage(message) {
  const value = String(message ?? '').trim();
  if (!value || /[\r\n]/.test(value)) return false;
  return /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._/-]+\))?!?: .{1,72}$/i.test(value);
}
