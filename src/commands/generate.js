import chalk from 'chalk';
import { inspect, printFiles } from './shared.js';
import { analyzeChanges } from '../generator/analyzer.js';
import { CommitMateError } from '../utils/errors.js';
export async function generateCommand() {
  const { status, diff } = await inspect();
  if (status.clean) { console.log('No changes detected.'); return; }
  printFiles(status);
  const result = analyzeChanges({ files: status.files, diff: diff.combined, stats: diff.stats });
  if (result.needsContext) throw new CommitMateError(`${result.reason}\nAdd context with: commit-mate commit -m "type(scope): describe your intent"`);
  console.log(chalk.bold('\nSuggested commit messages:'));
  result.suggestions.forEach((item, i) => console.log(`${i + 1}. ${chalk.cyan(item.message)} ${chalk.dim(`— ${item.label}`)}`));
}
