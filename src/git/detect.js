import { git } from './runner.js';
export async function detectRepository(cwd = process.cwd()) {
  try { return (await git(['rev-parse', '--show-toplevel'], { cwd })).trim(); }
  catch (error) { if (/not a git repository/i.test(error.message)) return null; throw error; }
}
