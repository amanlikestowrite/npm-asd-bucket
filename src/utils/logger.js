import chalk from 'chalk';
export const heading = (text) => console.log(`\n${chalk.bold.cyan(text)}`);
export const success = (text) => console.log(chalk.green(`✓ ${text}`));
export const info = (text) => console.log(chalk.dim(text));
export const error = (text) => console.error(chalk.red(`✗ ${text}`));
