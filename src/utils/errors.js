export class CommitMateError extends Error {
  constructor(message, options = {}) { super(message, options); this.name = 'CommitMateError'; }
}

export function formatError(error) {
  if (error?.name === 'ExitPromptError' || error?.name === 'AbortPromptError') return 'Operation cancelled.';
  return error instanceof Error ? error.message : String(error);
}
