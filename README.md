# Commit Mate

Commit Mate is a lightweight command-line companion for writing clear [Conventional Commit](https://www.conventionalcommits.org/) messages. It inspects Git changes locally and never sends your diff to a service.

## Features

- Finds the current Git repository and reports staged, unstaged, untracked, renamed, and deleted files.
- Shows staged and unstaged diffs and previews readable untracked files.
- Suggests three message styles when the change intent can be inferred; asks for your context when it cannot.
- Offers an interactive picker, custom message entry, and a confirmation before creating a commit.
- Never stages files, amends commits, force commits, or pushes.
- Runs entirely locally with no API key or network request.

## Installation

```sh
npm install -g commit-mate
# or run without installing
npx commit-mate
```

Requires Node.js 18.18 or newer and Git on your PATH.

## Commands

```sh
commit-mate                         # interactive workflow
commit-mate generate                # print local suggestions
commit-mate diff                    # summarize staged and working tree changes
commit-mate commit -m "feat(auth): add login"  # confirm and commit the index
commit-mate --help
commit-mate --version
```

Interactive example:

```text
  COMMIT MATE
Your Git commit companion.
✔ Repository analyzed

1 changed file
  src/auth/login.js (staged)

Suggested commit messages:
1. feat(auth): add login — Concise
2. feat(auth): introduce login based on the current changes — Descriptive
3. feat(auth): add login — Conventional
```

The interactive flow lets you select a suggestion, write your own message, review the exact message, and confirm. The default confirmation is No. A commit uses only files already in Git's index. Stage the intended files yourself with `git add`; unstaged files remain untouched. With mixed staged and unstaged edits, Git commits the staged snapshot only.

## Message types

`feat` new feature · `fix` bug fix · `docs` documentation · `style` formatting · `refactor` restructuring · `perf` performance · `test` tests · `build` build system · `ci` automation · `chore` maintenance · `revert` reversal.

Messages follow `type(scope): description` and are checked for supported type, single-line format, and a description up to 72 characters. Scope is optional. Examples: `feat(auth): add Google OAuth authentication`, `fix(api): handle missing user identifiers`, `docs(readme): update installation instructions`.

## Local generation engine

The initial engine uses filenames, Git status, diff markers, and line statistics. It applies small deterministic rules to recognize common categories and only emits a suggestion when it can identify a concrete action such as adding a new file, removing a file, updating documentation, or changing test files. For ambiguous text edits or binary/unreadable content it asks you to supply intent rather than inventing a claim. This heuristic engine is intentionally conservative; review suggestions before committing. The `analyzeChanges` interface is isolated so a future provider can be added without coupling it to Git or the CLI. No AI service is used now.

## Configuration

No configuration is required. Use Git's normal identity settings (`user.name` and `user.email`) before committing. Commit Mate does not change Git configuration.

## Development

```sh
git clone https://github.com/amanlikestowrite/npm-asd-bucket.git
cd npm-asd-bucket
npm install
npm test
npm run lint
node src/cli.js --help
```

Tests use temporary repositories under the operating system temp directory and clean them afterward. To publish, replace the placeholder author and repository metadata in `package.json`, verify the version and package contents with `npm pack --dry-run`, run `npm test`, then authenticate and run `npm publish` (use `npm publish --access public` for a public scoped package; this package is unscoped).

## Contributing

Issues and pull requests are welcome. Keep changes focused, add tests for behavior changes, and ensure `npm test` and `npm run lint` pass. Never include real credentials or private repository data in fixtures.

## License

MIT. See [LICENSE](LICENSE).
