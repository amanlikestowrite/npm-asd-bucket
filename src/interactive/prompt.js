import { select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { inspect, printFiles } from '../commands/shared.js';
import { analyzeChanges } from '../generator/analyzer.js';
import { validateCommitMessage } from '../generator/formatter.js';
import { git } from '../git/runner.js';
import { CommitMateError } from '../utils/errors.js';

export async function interactiveCommand() {
  console.log(chalk.bold.cyan('\n  COMMIT MATE\n'), chalk.dim('Your Git commit companion.'));
  const { root, status, diff } = await inspect();
  if (status.clean) { console.log('No changes detected.'); return; }
  if (!status.staged) throw new CommitMateError('Nothing is staged for commit. Stage the intended files with Git, then try again. Commit Mate never stages files automatically.');
  printFiles(status);
  const stagedFiles = status.files.filter((file) => file.staged);
  const stagedPaths = new Set(stagedFiles.map((file) => file.path));
  const stagedStats = diff.stats.filter((item) => stagedPaths.has(item.path));
  const result = analyzeChanges({ files: stagedFiles, diff: diff.staged, stats: stagedStats });
  const choices = result.suggestions.map((s, i) => ({ name: `${i + 1}. ${s.message} (${s.label})`, value: s.message }));
  choices.push({ name: `${choices.length + 1}. Write my own message`, value: 'custom' }, { name: `${choices.length + 2}. Cancel`, value: 'cancel' });
  if (result.needsContext) console.log(chalk.yellow(`\n${result.reason}`));
  const selection = await select({ message: 'Choose a commit message', choices });
  if (selection === 'cancel') { console.log('Commit cancelled.'); return; }
  const message = (selection === 'custom' ? await input({ message: 'Commit message:' }) : selection).trim();
  if (!validateCommitMessage(message)) throw new CommitMateError('Invalid commit message. Use Conventional Commit format, e.g. "fix(api): handle missing identifiers".');
  console.log(`\n${chalk.bold('Commit preview')}\n${chalk.cyan(message)}`);
  if (!await confirm({ message: 'Create this commit?', default: false })) { console.log('Commit cancelled.'); return; }
  await git(['-C', root, 'commit', '-m', message]);
  console.log(chalk.green('Commit created.'));
}
