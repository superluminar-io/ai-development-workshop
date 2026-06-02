You are reviewing a pull request. Use GitHub MCP to gather full context before reviewing.
Do not approve or merge anything. Produce a structured review only.

**Demo repo:** `superluminar-io/ai-development-ws-ticket-demo`

---

## Step 1: Gather context via GitHub MCP

Use GitHub MCP to fetch:
- The open PR: title, description, and all comments
- All issues linked in the PR description
- The list of commits in the PR

Read all of this before looking at any code.

## Step 2: State the intent

Based on the PR description and linked issue, write one sentence describing what this change is supposed to do. Quote directly from the PR description or issue.

## Step 3: Review the diff against the intent

For each of the following, be specific — quote file names, line numbers, and relevant text from the PR or issue:

1. **Intent match** — [does the implementation do what the PR description says?]
2. **Type safety** — [are new types as precise as they should be?]
3. **Test coverage** — [what new behaviour is untested?]
4. **Edge cases** — [what cases from the linked issue are not handled?]

## Step 4: Produce a structured review

- **Summary:** what the PR does (one sentence)
- **Issues found:** list each issue, labelled by what context was needed to find it (diff / PR description / linked issue)
- **Risk:** Low / Medium / High — and why
- **Recommendation:** Approve / Request changes / Needs discussion
