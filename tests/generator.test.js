import { describe, expect, it } from 'vitest';
import { analyzeChanges } from '../src/generator/analyzer.js';
describe('analyzeChanges', () => {
  it('returns three suggestions when the diff supports an action', () => {
    const result = analyzeChanges({ files: [{ path: 'src/auth/login.js' }], diff: 'diff --git a/src/auth/login.js b/src/auth/login.js\nnew file mode 100644\n+ export function login() {}' });
    expect(result.suggestions).toHaveLength(3);
    expect(result.suggestions[0].message).toMatch(/^feat\(src\): add login$/);
  });
  it('asks for context for ambiguous changes', () => {
    expect(analyzeChanges({ files: [{ path: 'src/app.js' }], diff: '-old\n+new' }).needsContext).toBe(true);
  });
});
