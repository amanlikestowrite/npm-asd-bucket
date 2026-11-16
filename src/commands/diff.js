import chalk from 'chalk';
import { inspect, printFiles } from './shared.js';
export async function diffCommand() {
  const { status, diff } = await inspect();
  if (status.clean) { console.log('Working tree is clean.'); return; }
  printFiles(status);
  console.log(chalk.bold('\nChange summary'));
  const additions = diff.stats.reduce((n, s) => n + s.additions, 0);
  const deletions = diff.stats.reduce((n, s) => n + s.deletions, 0);
  console.log(chalk.green(`+${additions}`), chalk.red(`-${deletions}`));
  if (diff.staged) console.log(chalk.bold('\nStaged diff\n'), diff.staged);
  if (diff.unstaged) console.log(chalk.bold('\nUnstaged diff\n'), diff.unstaged);
  if (diff.untracked) console.log(chalk.bold('\nUntracked file previews\n'), diff.untracked);
}
