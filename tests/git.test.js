import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm, writeFile, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { spawnSync } from 'node:child_process';
import { detectRepository, getStatus, getDiff } from '../src/index.js';
const dirs = [];
async function repo() {
  const dir = await mkdtemp(path.join(tmpdir(), 'commit-mate-')); dirs.push(dir);
  execFileSync('git', ['init', '-q', dir]);
  execFileSync('git', ['-C', dir, 'config', 'user.email', 'test@example.com']);
  execFileSync('git', ['-C', dir, 'config', 'user.name', 'Test']);
  return dir;
}
afterEach(async () => { await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))); });
describe('Git integration', () => {
  it('detects a repository, reads untracked files, and reports clean state', async () => {
    const dir = await repo();
    expect(await detectRepository(dir)).toBe(await realpath(dir));
    expect((await getStatus(dir)).clean).toBe(true);
    await writeFile(path.join(dir, 'README.md'), '# Hello\n');
    const status = await getStatus(dir);
    expect(status.files[0].untracked).toBe(true);
    expect((await getDiff(dir)).combined).toContain('# Hello');
  });
  it('detects staged and unstaged changes separately', async () => {
    const dir = await repo();
    await writeFile(path.join(dir, 'a.txt'), 'one\n');
    execFileSync('git', ['-C', dir, 'add', 'a.txt']); execFileSync('git', ['-C', dir, 'commit', '-qm', 'init']);
    await writeFile(path.join(dir, 'a.txt'), 'two\n'); execFileSync('git', ['-C', dir, 'add', 'a.txt']);
    await writeFile(path.join(dir, 'a.txt'), 'three\n');
    const status = await getStatus(dir); const diff = await getDiff(dir);
    expect(status.staged && status.unstaged).toBe(true);
    expect(diff.staged).toContain('+two'); expect(diff.unstaged).toContain('+three');
  });
  it('runs the generate command in a separate temporary repository', async () => {
    const dir = await repo();
    await writeFile(path.join(dir, 'README.md'), '# Commit Mate\n');
    const cli = path.resolve('src/cli.js');
    const result = spawnSync(process.execPath, [cli, 'generate'], { cwd: dir, encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('docs(readme): update project documentation');
  });
});
