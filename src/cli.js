#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { interactiveCommand } from './interactive/prompt.js';
import { generateCommand } from './commands/generate.js';
import { diffCommand } from './commands/diff.js';
import { commitCommand } from './commands/commit.js';
import { formatError } from './utils/errors.js';

const program = new Command();
program.name('commit-mate').description('A friendly CLI for clear Conventional Commit messages.').version('0.1.0');
program.addHelpText('after', `\nExamples:\n  $ commit-mate\n  $ commit-mate generate\n  $ commit-mate diff\n  $ commit-mate commit -m "feat(auth): add login"`);
program.command('generate').description('Analyze changes and suggest commit messages').action(generateCommand);
program.command('diff').description('Summarize staged, unstaged, and untracked changes').action(diffCommand);
program.command('commit').description('Commit staged changes with a supplied Conventional Commit message').option('-m, --message <message>', 'commit message').action((options) => commitCommand(options.message));
program.action(interactiveCommand);
program.exitOverride();
try { await program.parseAsync(process.argv); }
catch (error) {
  if (error.code?.startsWith('commander.')) process.exitCode = error.exitCode ?? 0;
  else { console.error(chalk.red(`\n${formatError(error)}`)); process.exitCode = error.name === 'ExitPromptError' ? 0 : 1; }
}
