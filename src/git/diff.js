import { git } from './runner.js';
import { getStatus } from './status.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function getDiff(cwd = process.cwd()) {
  const [staged, unstaged] = await Promise.all([
    git(['diff', '--cached', '--no-ext-diff', '--unified=2', '--'], { cwd }),
    git(['diff', '--no-ext-diff', '--unified=2', '--'], { cwd }),
  ]);
  const status = await getStatus(cwd);
  const untracked = [];
  for (const file of status.files.filter((item) => item.untracked)) {
    try { untracked.push(`Untracked file: ${file.path}\n${(await readFile(path.resolve(cwd, file.path), 'utf8')).slice(0, 12000)}`); }
    catch { untracked.push(`Untracked file: ${file.path} (content is not readable as UTF-8)`); }
  }
  return { staged, unstaged, untracked: untracked.join('\n\n'), combined: [staged, unstaged, ...untracked].filter(Boolean).join('\n'), stats: await getDiffStats(cwd) };
}

async function getDiffStats(cwd) {
  const [staged, unstaged] = await Promise.all([
    git(['diff', '--cached', '--numstat', '--'], { cwd }),
    git(['diff', '--numstat', '--'], { cwd }),
  ]);
  return [...staged, ...unstaged].filter(Boolean).join('').split('\n').filter(Boolean).map((line) => {
    const [add, del, path] = line.split('\t');
    return { additions: add === '-' ? 0 : Number(add), deletions: del === '-' ? 0 : Number(del), path };
  });
}
