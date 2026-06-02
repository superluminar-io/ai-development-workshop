Write a concise pull request summary based on the current diff and test results.

First run:
```
git diff HEAD
```

Then run:
```
npm test
```

Read both outputs before writing anything.

The PR summary should include:

1. **What changed** — 2–3 sentences describing the change and why
2. **Files modified** — list with one-line description per file
3. **Tests** — what was added or updated, and whether they pass
4. **Limitations** — what this change does not cover
5. **Risks** — anything the reviewer should pay close attention to
6. **Follow-up** — work that should happen next but is not in this PR

Write as if explaining to a colleague who will review this. Be accurate — only describe things you verified in the diff and test output.
