import { describe, expect, it } from 'vitest';
import { formatCommit, validateCommitMessage } from '../src/generator/formatter.js';
describe('commit formatter', () => {
  it('formats scoped and breaking messages', () => {
    expect(formatCommit({ type: 'feat', scope: 'Auth', description: 'add login.' })).toBe('feat(auth): add login');
    expect(formatCommit({ type: 'fix', description: 'handle errors', breaking: true })).toBe('fix!: handle errors');
  });
  it('rejects unsupported and multiline messages', () => {
    expect(() => formatCommit({ type: 'feature', description: 'x' })).toThrow();
    expect(validateCommitMessage('update')).toBe(false);
    expect(validateCommitMessage('feat(ui): add nav')).toBe(true);
  });
});
