import { git } from './runner.js';

export async function getStatus(cwd = process.cwd()) {
  const raw = await git(['status', '--porcelain=v1', '-z', '--untracked-files=all'], { cwd });
  const entries = raw.split('\0');
  const files = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) continue;
    const code = entry.slice(0, 2);
    const file = entry.slice(3);
    files.push({ path: file, code, staged: code[0] !== ' ' && code[0] !== '?', unstaged: code[1] !== ' ', untracked: code === '??', deleted: code.includes('D'), renamedFrom: null });
    if (code.includes('R') || code.includes('C')) { files.at(-1).renamedFrom = entries[++i] || null; }
  }
  return { files, staged: files.some((f) => f.staged), unstaged: files.some((f) => f.unstaged || f.untracked), clean: files.length === 0 };
}
