# Exercise 1: Review Without Context

**Goal:** Use the review workflow from Module 1 on a real PR — and discover what it cannot tell you.

**Duration:** ~15 minutes  
**Repo guide:** This exercise uses the **[demo repo via MCP]** as the target, but you run all commands from the **[workshop repo]**.

---

## Before you start

**[workshop repo]** Confirm your baseline is clean:

```bash
npm test
```

Expected: 14 tests passing.

---

## Step 1 — Find the open PR (~2 min)

Ask the facilitator for the URL of the open PR on the demo repo:

`https://github.com/superluminar-io/ai-development-ws-ticket-demo/pull/<number>`

Open it in your browser. Read the PR title and description. Do not look at the code yet.

**Note:** You are looking at the **[demo repo]** in the browser. You will review it using Claude Code running in the **[workshop repo]**.

---

## Step 2 — Copy the diff into Claude (~3 min)

In your browser, open the PR's **Files changed** tab. This is the diff.

**[workshop repo]** In Claude Code, paste the diff and run:

```
/review-diff
```

If `/review-diff` asks for a git diff, tell Claude:
> "I am pasting a diff from a GitHub PR. Please review it as if you were a pull request reviewer."

Then paste the diff content.

> **Note:** `/review-diff` was built in Module 1. It runs `git diff HEAD` on the workshop repo — which won't see the demo repo's PR. For this exercise, paste the diff manually. In Exercise 2, GitHub MCP solves this.

---

## Step 3 — Note what Claude cannot answer (~5 min)

**[workshop repo]** Read Claude's review. Then ask:

> "What questions do you still have that the diff alone could not answer?"

Write down Claude's unanswered questions. You should see gaps like:
- Why was this change made?
- Does the implementation match what was requested?
- Are there business rules being violated that are not visible in the code?

Keep this list — you will compare it to the Exercise 2 review.

---

## Step 4 — Try to answer the gaps yourself (~5 min)

**[workshop repo]** Without any tools, try to answer Claude's unanswered questions using only:
- The PR title and description you read in Step 1
- The diff

Note which questions you can answer and which you cannot.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A review of the sample PR produced by `/review-diff`
- [ ] A list of unanswered questions from Claude
- [ ] A note on which questions the PR description answered and which it did not

You have not changed any files. No commits yet.

---

## Reflection questions

- Which gaps surprised you? Which did you expect?
- If you were the PR author, what would you add to the PR description to help a reviewer?
- What would a reviewer need to see that neither the diff nor the description provided?
