Review the current git diff as if you were a reviewer on a pull request.
Do not edit any files.

First run this command and read the output carefully:

```
git diff HEAD
```

Then assess each change against these criteria:

1. **Correctness** — does the change do what it claims? Are there inputs it does not handle?
2. **Type safety** — are there loose types, implicit `any`, or missing null checks?
3. **Behaviour changes** — does this change existing behaviour? Is that intentional?
4. **Test coverage** — do the tests cover the important cases? What is missing?
5. **Risks** — what could go wrong in a production deployment?
6. **Follow-up work** — what is not done yet but should be tracked?

Be specific. Reference file names and line numbers.
Do not approve the change unless you have actually read the full diff.
State your confidence level for each finding.
