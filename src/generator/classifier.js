const RULES = [
  ['revert', /(^|\/)(revert|reverts?)(\/|$)|revert/i],
  ['test', /(^|\/)(test|tests|__tests__)(\/|$)|\.(test|spec)\.[^.]+$/i],
  ['docs', /(^|\/)(docs?|documentation)(\/|$)|readme|\.md$/i],
  ['ci', /(^|\/)(\.github|\.circleci|\.gitlab)(\/|$)|jenkins|azure-pipelines/i],
  ['build', /(^|\/)(webpack|vite|rollup|tsconfig|babel|package\.json|package-lock|pnpm-lock|yarn\.lock|makefile)/i],
  ['style', /\.(css|scss|sass|less|html)$/i],
  ['perf', /performance|cache|optimi[sz]/i],
  ['fix', /fix|bug|error|issue|crash|patch/i],
  ['feat', /feature|add|new|implement|create|new file mode|^\+\s*(export|function|class|const|let)\b/im],
];
export function classifyChanges({ files = [], diff = '' } = {}) {
  const material = `${files.map((f) => f.path ?? f).join('\n')}\n${diff}`;
  for (const [type, pattern] of RULES) if (pattern.test(material)) return type;
  return 'chore';
}

export function inferScope(files = []) {
  const paths = files.map((f) => f.path ?? f).filter(Boolean);
  if (!paths.length) return undefined;
  if (paths.length === 1 && !paths[0].includes('/')) return paths[0].replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() || undefined;
  const segments = paths.map((p) => p.split('/')[0]);
  const common = segments.every((s) => s === segments[0]) && paths.some((p) => p.includes('/')) ? segments[0] : undefined;
  return common && common !== '.' ? common.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() : undefined;
}
