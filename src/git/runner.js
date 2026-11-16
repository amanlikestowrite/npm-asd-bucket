import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { CommitMateError } from '../utils/errors.js';
const execFileAsync = promisify(execFile);

export async function git(args, options = {}) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: options.cwd ?? process.cwd(), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, windowsHide: true });
    return stdout;
  } catch (cause) {
    if (cause.code === 'ENOENT') throw new CommitMateError('Git is not installed or could not be found on PATH.', { cause });
    const detail = (cause.stderr || cause.message || '').trim();
    throw new CommitMateError(detail || 'Git command failed.', { cause });
  }
}
