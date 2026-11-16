import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { git } from '../git/runner.js';
import { validateCommitMessage } from '../generator/formatter.js';
import { inspect } from './shared.js';
import { CommitMateError } from '../utils/errors.js';

export async function commitCommand(message) {
  const { root, status } = await inspect();
  if (status.clean) throw new CommitMateError('No changes to commit.');
  if (!status.staged) throw new CommitMateError('Nothing is staged for commit. Stage the intended files with Git, then try again. Commit Mate never stages files automatically.');
  let finalMessage = message?.trim();
  if (!finalMessage) finalMessage = (await input({ message: 'Commit message:' })).trim();
  if (!validateCommitMessage(finalMessage)) throw new CommitMateError('Invalid commit message. Use one line in Conventional Commit format, e.g. "feat(auth): add login" (description max 72 characters).');
  console.log(`\n${chalk.bold('Commit preview')}\n${chalk.cyan(finalMessage)}`);
  if (!await confirm({ message: 'Create this commit?', default: false })) { console.log('Commit cancelled.'); return; }
  await git(['-C', root, 'commit', '-m', finalMessage]);
  console.log(chalk.green('Commit created.'));
}
