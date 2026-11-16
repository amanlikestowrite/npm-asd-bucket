import chalk from 'chalk';
import ora from 'ora';
import { detectRepository } from '../git/detect.js';
import { getStatus } from '../git/status.js';
import { getDiff } from '../git/diff.js';
import { CommitMateError } from '../utils/errors.js';

export async function inspect(cwd = process.cwd()) {
  const root = await detectRepository(cwd);
  if (!root) throw new CommitMateError('This directory is not inside a Git repository.');
  const spinner = ora('Analyzing repository changes…').start();
  try {
    const [status, diff] = await Promise.all([getStatus(root), getDiff(root)]);
    spinner.succeed('Repository analyzed');
    return { root, status, diff };
  } catch (error) { spinner.fail('Could not analyze repository'); throw error; }
}
export function printFiles(status) {
  console.log(chalk.bold(`\n${status.files.length} changed ${status.files.length === 1 ? 'file' : 'files'}`));
  for (const file of status.files) {
    const state = file.untracked ? 'untracked' : file.deleted ? 'deleted' : file.staged && file.unstaged ? 'staged + unstaged' : file.staged ? 'staged' : 'modified';
    console.log(`  ${chalk.cyan(file.path)} ${chalk.dim(`(${state})`)}`);
  }
}
