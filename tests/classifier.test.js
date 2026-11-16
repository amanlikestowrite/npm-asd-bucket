import { describe, expect, it } from 'vitest';
import { classifyChanges } from '../src/generator/classifier.js';
describe('classifyChanges', () => {
  it('recognizes test, docs, ci, fix, and default maintenance changes', () => {
    expect(classifyChanges({ files: [{ path: 'src/user.test.js' }] })).toBe('test');
    expect(classifyChanges({ files: [{ path: 'README.md' }] })).toBe('docs');
    expect(classifyChanges({ files: [{ path: '.github/workflows/ci.yml' }] })).toBe('ci');
    expect(classifyChanges({ diff: '+// fix null error' })).toBe('fix');
    expect(classifyChanges({ files: [{ path: 'src/app.js' }] })).toBe('chore');
  });
});
