import { classifyChanges, inferScope } from './classifier.js';
import { formatCommit } from './formatter.js';

const meaningfulPaths = (files) => files.map((f) => f.path).filter((p) => p && !p.startsWith('.git/'));
function describe(files, diff, stats) {
  const paths = meaningfulPaths(files);
  if (paths.length && paths.every((p) => /(^|\/)(readme|license|changelog)(\.|$)/i.test(p) || /\.md$/i.test(p))) return 'update project documentation';
  if (paths.length && paths.every((p) => /(^|\/)(test|tests|__tests__)(\/|$)|\.(test|spec)\./i.test(p))) return 'update automated tests';
  if (!diff.trim()) {
    if (!paths.length) return null;
    return null;
  }
  if (/^diff --git .*\nnew file mode/m.test(diff)) return `add ${paths.length === 1 ? shortName(paths[0]) : `${paths.length} files`}`;
  if (/^diff --git .*\ndeleted file mode/m.test(diff)) return `remove ${paths.length === 1 ? shortName(paths[0]) : `${paths.length} files`}`;
  if (stats?.length && stats.every((s) => s.additions === 0 && s.deletions > 0)) return `remove unused content from ${shortName(paths[0])}`;
  return null;
}
function shortName(path = 'project') { return path.split('/').at(-1).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '); }
export function analyzeChanges({ files = [], diff = '', stats = [] }) {
  const type = classifyChanges({ files, diff });
  const scope = inferScope(files);
  const inferred = describe(files, diff, stats);
  if (!inferred) return { needsContext: true, reason: diff.trim() ? 'The diff does not reveal the intent clearly enough to suggest an accurate message.' : 'These file changes have no readable text diff, so their intent is unclear.', suggestions: [] };
  const concise = formatCommit({ type, scope, description: inferred });
  const verb = inferred.startsWith('add ') ? 'introduce' : inferred.startsWith('remove ') ? 'remove' : 'update';
  const descriptive = formatCommit({ type, scope, description: `${verb} ${inferred.replace(/^(add|remove|update) /, '')} based on the current changes` });
  const conventional = formatCommit({ type, scope, description: inferred });
  return { needsContext: false, type, scope, suggestions: [
    { label: 'Concise', message: concise }, { label: 'Descriptive', message: descriptive }, { label: 'Conventional', message: conventional },
  ] };
}
