# Module: Communicating with AI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `module-prompting` essentials module covering LLM mental model, core prompt patterns, and prompt iteration — slotted before module-1 in the essentials track.

**Architecture:** One entry added to `config.ts`'s `allModules` array (with `allModules` exported for testability); seven new markdown files under `docs/module-prompting/`. No changes to existing module content or workshop config.

**Tech Stack:** TypeScript, Vitest, Markdown

---

## File Map

**Create:**
- `docs/module-prompting/README.md`
- `docs/module-prompting/participant-guide.md`
- `docs/module-prompting/facilitator-guide.md`
- `docs/module-prompting/exercises/exercise-1-vague-to-precise.md`
- `docs/module-prompting/exercises/exercise-2-few-shot.md`
- `docs/module-prompting/exercises/exercise-3-chain-of-thought.md`
- `docs/module-prompting/exercises/exercise-4-structured-output.md`

**Modify:**
- `docs-site/src/config.ts` — export `allModules`, add `module-prompting` entry
- `docs-site/src/__tests__/config.test.ts` — add test for `module-prompting` entry

---

### Task 1: Register module-prompting in config.ts

**Files:**
- Modify: `docs-site/src/config.ts`
- Test: `docs-site/src/__tests__/config.test.ts`

- [ ] **Step 1: Export allModules from config.ts**

In `docs-site/src/config.ts`, find:
```ts
const allModules: Module[] = [
```
Change to:
```ts
export const allModules: Module[] = [
```

- [ ] **Step 2: Write a failing test**

In `docs-site/src/__tests__/config.test.ts`, add this import at the top alongside the existing ones:
```ts
import { filterModules, assignDisplayNumbers, resolveTracks, filterExercises, allModules } from '../config'
```

Then add this describe block at the end of the file:
```ts
describe('allModules', () => {
  it('includes module-prompting with correct metadata', () => {
    const mod = allModules.find((m) => m.id === 'module-prompting')
    expect(mod).toBeDefined()
    expect(mod?.title).toBe('Communicating with AI')
    expect(mod?.level).toBe('essentials')
    expect(mod?.audience).toBe('engineer')
    expect(mod?.exercises).toHaveLength(4)
    expect(mod?.exercises[0].slug).toBe('exercise-1-vague-to-precise')
    expect(mod?.exercises[1].slug).toBe('exercise-2-few-shot')
    expect(mod?.exercises[2].slug).toBe('exercise-3-chain-of-thought')
    expect(mod?.exercises[3].slug).toBe('exercise-4-structured-output')
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

```
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -A 5 "module-prompting"
```

Expected: FAIL — `mod` is `undefined`

- [ ] **Step 4: Add module-prompting to allModules**

In `docs-site/src/config.ts`, add this entry after the `module-5` entry (before the closing `]`):

```ts
  {
    id: 'module-prompting',
    number: '01',
    title: 'Communicating with AI',
    description:
      'Learn how LLMs process text, practise the core prompt patterns, and iterate on prompts that don\'t work.',
    status: 'ready',
    participantGuide: '/docs/module-prompting/participant-guide.md',
    level: 'essentials',
    audience: 'engineer',
    exercises: [
      {
        slug: 'exercise-1-vague-to-precise',
        title: 'From Vague to Precise',
        file: '/docs/module-prompting/exercises/exercise-1-vague-to-precise.md',
      },
      {
        slug: 'exercise-2-few-shot',
        title: 'Teaching by Example',
        file: '/docs/module-prompting/exercises/exercise-2-few-shot.md',
      },
      {
        slug: 'exercise-3-chain-of-thought',
        title: 'Asking for Reasoning',
        file: '/docs/module-prompting/exercises/exercise-3-chain-of-thought.md',
      },
      {
        slug: 'exercise-4-structured-output',
        title: 'Structured Output',
        file: '/docs/module-prompting/exercises/exercise-4-structured-output.md',
      },
    ],
  },
```

- [ ] **Step 5: Run typecheck**

```
cd docs-site && npm run typecheck
```

Expected: no errors

- [ ] **Step 6: Run all tests**

```
cd docs-site && npm test
```

Expected: all tests pass including the new `allModules` test

- [ ] **Step 7: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/__tests__/config.test.ts
git commit -m "feat: register module-prompting in config.ts"
```

---

### Task 2: Create README.md

**Files:**
- Create: `docs/module-prompting/README.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/README.md` with this exact content:

```markdown
# Module: Communicating with AI

**Duration:** ~65 minutes  
**Type:** Hands-on exercises  

## What you will practise

- Understanding how LLMs process text: tokens, context windows, and probabilistic output
- Writing clear, specific prompts by adding context, constraints, and format instructions
- Applying zero-shot and few-shot prompting to the same task
- Using chain-of-thought prompting to expose model reasoning
- Getting consistently structured JSON output from a language model

## Exercises

1. [Exercise 1: From Vague to Precise](exercises/exercise-1-vague-to-precise.md)
2. [Exercise 2: Teaching by Example](exercises/exercise-2-few-shot.md)
3. [Exercise 3: Asking for Reasoning](exercises/exercise-3-chain-of-thought.md)
4. [Exercise 4: Structured Output](exercises/exercise-4-structured-output.md)

Or follow the [Participant Guide](participant-guide.md) for the full walkthrough.

## Prerequisites

- Claude Code CLI installed and authenticated, or access to claude.ai
- No familiarity with the workshop codebase required
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/README.md
git commit -m "docs: add module-prompting README"
```

---

### Task 3: Create participant-guide.md

**Files:**
- Create: `docs/module-prompting/participant-guide.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/participant-guide.md` with this exact content:

```markdown
# Module: Communicating with AI

> Complete the **Setup** module before starting here.

---

## How LLMs process text

**Tokens**  
Language models don't read words — they read tokens. A token is roughly 3–4 characters. "Unbelievable" is three tokens; "cat" is one. Why it matters: prompt length affects cost and speed, and very long prompts can exceed a model's limits. For the exercises in this module, token counts are not a concern — but understanding tokens helps you reason about why some prompts are slow or expensive in production.

**Context window**  
Everything a model sees in one session is called the context window: your messages, the model's replies, any files you include. The model has no memory outside this window — it cannot recall a prompt you wrote in a different session. Current models handle large context windows (100,000+ tokens), but the key point is that clarity within a single prompt matters more than accumulating history across sessions.

**Probabilistic output**  
A language model predicts the most likely next token given everything in the context. This means the same prompt does not always produce the same output. When you test a prompt once and it works, that is not evidence it will always work. Run prompts multiple times; look for consistency, not just a single good result.

---

## Exercises

- **Exercise 1 — From Vague to Precise:** Run three weak prompts and iteratively improve one. Learn how specificity, context, and output constraints affect what Claude returns.
- **Exercise 2 — Teaching by Example:** Classify support messages zero-shot, then add few-shot examples and compare the output for edge cases.
- **Exercise 3 — Asking for Reasoning:** Compare direct answers versus chain-of-thought on an ambiguous matching task. Observe what changes and what stays the same.
- **Exercise 4 — Structured Output:** Extract fields from unstructured text as JSON by specifying a schema and adding a one-shot example.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/participant-guide.md
git commit -m "docs: add module-prompting participant guide"
```

---

### Task 4: Create facilitator-guide.md

**Files:**
- Create: `docs/module-prompting/facilitator-guide.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/facilitator-guide.md` with this exact content:

```markdown
# Module Facilitator Guide

**Communicating with AI**

---

## Learning goals

By the end of this module participants should be able to:

1. Explain at a working level how LLMs process input — tokens, context windows, probabilistic output
2. Write prompts that specify context, constraints, and output format explicitly
3. Use zero-shot and few-shot prompting and identify when each is appropriate
4. Apply chain-of-thought prompting to make model reasoning visible
5. Write a prompt that reliably returns structured JSON

**The meta-skill:** understanding that prompt quality is engineering — it is iterative, testable, and improvable through deliberate practice.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Intro and concept check | 5 min |
| Exercise 1 | 15 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 18 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 15 min |
| Debrief Exercise 3 | 5 min |
| Exercise 4 | 15 min |
| Debrief Exercise 4 + wrap-up | 7 min |
| **Total** | **~90 min** |

> If time is short, see **Simplifications** below.

---

## Before the session

1. Confirm participants have Claude Code CLI installed and authenticated, or access to claude.ai.
2. Read all four exercises yourself and run each prompt once so you know what typical output looks like.
3. Note the ambiguous cases in Exercise 2 (messages 5 and 8) and the weak candidate match in Exercise 3 — these are the teaching moments.

---

## Opening remarks (~2 min)

Say: "We are not using Claude Code as a tool in this module — we are learning how to talk to it. Everything from here on depends on how clearly you can communicate what you want. This module is about that."

Briefly cover the three concepts from the participant guide — tokens, context window, probabilistic output. Keep it short; participants will have read the guide. The one point to land before Exercise 1: the same prompt can produce different output. That is not a bug.

---

## Common participant mistakes

### Adding more instructions to fix a vague prompt
Participants often respond to bad output by making the prompt longer and vaguer rather than more specific. Coach them: "What specifically is wrong with the output? Change only that."

### Accepting the first output
After one good result, participants often stop. Remind them: run it twice. Probabilistic output means once is not enough.

### Treating chain-of-thought reasoning as verification
In Exercise 3, participants may conclude that chain-of-thought makes Claude reliable. Push back: "Claude generated a reasoning chain that led to an answer. Is that reasoning chain checked against anything?"

### Specifying a JSON schema but skipping the example
Participants often find that a schema alone does not produce consistent output. Exercise 4 is designed to expose this. Let them hit the problem before giving the solution.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "Which weak prompt was closest to useful? What was the one thing it was missing?"
- "Did anyone's improved prompt capture Priya's ownership of the payment coverage task and the end-of-quarter deadline for the accessibility audit? Read it out."
- "How long is your improved prompt compared to Prompt A? Is that a fair trade?"

**What good looks like:**
- Participants specified output format explicitly, not just content
- At least one improved prompt captured both Priya's task and the end-of-quarter deadline
- Participants ran their improved prompt and compared it to the weak versions

**Teaching point:** Precision is not verbosity. A specific prompt is not a long one — it is one that leaves less room for interpretation.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Did few-shot change the category for any message? Which one?"
- "How would you classify message 8? Could it reasonably be both a bug report and a complaint?"
- "What happened when you swapped the feature request example?"

**What good looks like:**
- Participants noticed message 8 is genuinely ambiguous and that few-shot examples drew the boundary in different places
- At least one participant identified that example selection shapes what each category means
- Participants ran both zero-shot and few-shot versions and compared

**Teaching point:** Few-shot examples are not just hints — they define what each category means. Choose examples that represent boundary cases, not just obvious ones.

---

## Exercise 3 debrief (5 min)

**Ask the group:**
- "Did chain-of-thought change the final yes/no answer, or just the explanation?"
- "When you asked Claude to argue the opposite — did it do it convincingly? What does that tell you?"
- "Where in your day-to-day work would chain-of-thought be worth the extra output length?"

**What good looks like:**
- Participants tested both prompts and compared answers, not just length
- At least one participant noticed Claude can argue both sides and found that unsettling
- Participants added a confidence level and noticed it often returns "medium"

**Teaching point:** Chain-of-thought makes reasoning visible, not correct. The reasoning is generated, not derived. Use it to check plausibility — not to verify truth.

---

## Exercise 4 debrief (7 min)

**Ask the group:**
- "After Step 1, what JSON shape did Claude choose? Was it useful?"
- "Did adding the schema remove all variation, or was there still inconsistency?"
- "What would you add after receiving this JSON in a real system?"

**What good looks like:**
- Participants progressed through all three steps and noted what each addition changed
- At least one participant ran the final prompt three times and noted output was mostly but not completely consistent
- Participants identified that a JSON code block in markdown is a common failure mode

**Teaching point:** Structured output prompting is engineering, not magic. Schema plus example gets you close. Parsing plus validation gets you the rest of the way. Design prompts assuming the output will occasionally be wrong.

---

## Connecting to the broader workshop arc

Use the wrap-up to preview module-1:

"Everything you practised here — specificity, constraints, output format, iteration — is what you will use in module-1 when you are working inside a real codebase. The context is larger and the stakes are higher. The same principles apply."

---

## Simplifications if time is short

If you have only 50–55 minutes:

- **Skip Exercise 3 Step 3** (push-back and confidence-level prompts). Keep Steps 1 and 2.
- **Skip Exercise 2 Step 3** (swapping the example). Keep Steps 1 and 2.
- **Shorten debriefs** to 2–3 minutes each.

The non-negotiable steps: improving a vague prompt (Exercise 1), seeing few-shot change an ambiguous classification (Exercise 2 messages 5 or 8), comparing zero-shot to chain-of-thought (Exercise 3 Steps 1 and 2), and getting valid JSON with a schema and example (Exercise 4 Step 3).

---

## Optional extensions for advanced participants

- Write a prompt that classifies support messages into more than four categories (add "billing issue" and "account access"). How does that change which few-shot examples you need?
- Take the Exercise 4 JSON schema and write a TypeScript Zod schema that validates it. What edge cases does the Zod schema expose?
- Combine chain-of-thought with structured output: get Claude to reason step-by-step and return its final answer as JSON.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/facilitator-guide.md
git commit -m "docs: add module-prompting facilitator guide"
```

---

### Task 5: Create exercise-1-vague-to-precise.md

**Files:**
- Create: `docs/module-prompting/exercises/exercise-1-vague-to-precise.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/exercises/exercise-1-vague-to-precise.md` with this exact content:

```markdown
# Exercise 1: From Vague to Precise

**Goal:** Observe how prompt precision affects output quality, and practise iterating from a weak prompt to a strong one.

**Duration:** ~15 minutes

---

## The scenario

You've been sent notes from a planning meeting and need to extract the key decisions. You have three prompt attempts from colleagues — each a little better than the last, but all lacking something. Your job is to improve on them.

Open a new Claude session. You can use Claude Code (`claude` from any directory) or claude.ai.

---

## Step 1 — Run three prompts (~7 min)

Copy the meeting notes below into your Claude session. Run each of the three prompts in **separate conversations** (start a new session for each, or prepend the notes to each prompt).

**Meeting notes:**

> Meeting: Q3 roadmap planning  
> Attendees: Sarah (Product), Dev (Engineering Lead), Marcus (Design), Priya (QA)
>
> Sarah opened by saying mobile app refresh is the top priority this quarter. Dev said the backend API changes needed for mobile would take about three weeks. Marcus showed mockups for a new onboarding flow — everyone agreed they looked good. Priya raised concerns about payment module test coverage: currently 40%, needs to reach 80% before anything new ships there.
>
> Dev mentioned the CI pipeline is slow — 18 minutes per run. Sarah said fix it but it's not urgent. Marcus asked about the accessibility audit; Sarah confirmed it must be completed before end of quarter. Dev volunteered to own the CI speed issue and estimated two weeks.
>
> Wrap-up: mobile app refresh is the top priority. Priya owns getting payment module coverage to 80%. Accessibility audit must be done by end of quarter. Dev will fix the CI pipeline on the side.

**Prompt A:** `What happened in this meeting?`

**Prompt B:** `List the important things from this meeting.`

**Prompt C:** `What were the decisions made in this meeting?`

For each prompt, note: How long is the output? How structured is it? Could you act on it directly?

**Checkpoint:** Can you answer "What does Priya own?" and "When is the accessibility audit due?" from each output, without re-reading the notes?

---

## Step 2 — Write an improved prompt (~5 min)

Write a prompt that produces output you could paste directly into a team Slack channel as an action items list. Your prompt should specify:
- What to extract (decisions, not summaries)
- What to include for each item (what was decided, who owns it, any deadline)
- The output format (numbered list)
- What to write when a field is missing ("not specified")

<details>
<summary>Hint: I'm not sure where to start</summary>

Start with the goal: "Extract every decision from the meeting notes below." Then add constraints one at a time. What does a good decision entry look like? What format do you want? What should Claude do if there's no owner?

</details>

---

## Step 3 — Compare (~3 min)

Run your improved prompt with the same meeting notes.

**Checkpoint:** Is the output more actionable? Did Claude include Priya's ownership of the payment coverage task and the end-of-quarter deadline for the accessibility audit?

---

## Reflection questions

- Which of the three weak prompts was closest to useful? What was the one thing it was missing?
- How long is your improved prompt compared to Prompt A? Is that a fair trade?
- When would a vague prompt be acceptable — is there a use case where "What happened in this meeting?" is good enough?

---

## Troubleshooting

**The outputs for all three prompts look the same to me**  
Read the structure, not just the content. Does one output use bullet points while another uses prose? Does one list owners and deadlines while another does not? Length and actionability often differ even when the raw information looks similar.

**My improved prompt is very long**  
That is expected. Specificity often requires length. Judge by output quality, not prompt brevity.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/exercises/exercise-1-vague-to-precise.md
git commit -m "docs: add exercise 1 (vague to precise)"
```

---

### Task 6: Create exercise-2-few-shot.md

**Files:**
- Create: `docs/module-prompting/exercises/exercise-2-few-shot.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/exercises/exercise-2-few-shot.md` with this exact content:

```markdown
# Exercise 2: Teaching by Example

**Goal:** Understand when few-shot prompting improves output quality over zero-shot, and identify the messages where it matters most.

**Duration:** ~18 minutes

---

## The scenario

You are building a support triage tool. It needs to classify incoming messages into one of four categories: **bug report**, **feature request**, **question**, or **complaint**. You are testing two approaches: asking the model directly (zero-shot) and giving it labelled examples (few-shot).

Open a new Claude session.

---

## Step 1 — Zero-shot classification (~5 min)

Use this prompt for messages 5, 8, and 9 below — these are the most ambiguous. Run them in the **same session**.

**Zero-shot prompt:**
```
Classify this support message as one of: bug report, feature request, question, or complaint. Reply with only the category name.

Message: "[paste message here]"
```

**Message 5:** "The search function doesn't seem to match partial words. If I type 'proj' it doesn't find 'project'. I expected autocomplete to work."

**Message 8:** "Your app logged me out mid-session and I lost 20 minutes of work. This keeps happening and I'm seriously considering cancelling."

**Message 9:** "How do I change the email address on my account?"

Note the category Claude assigns to each.

---

## Step 2 — Add few-shot examples (~8 min)

Update your prompt to include four labelled examples before the message:

```
Classify this support message as one of: bug report, feature request, question, or complaint. Reply with only the category name.

Examples:
"The login button doesn't respond on Safari." → bug report
"Please add a dark mode option." → feature request
"How do I reset my password?" → question
"I've been waiting two weeks for a response and this is unacceptable." → complaint

Message: "[paste message here]"
```

Run the same three messages with the new prompt. Note whether any categorisations changed.

**Checkpoint:** Did message 8 change category? Why might it be ambiguous — is it a bug report (keeps happening) or a complaint (considering cancelling)?

---

## Step 3 — Swap an example (~5 min)

Replace the "dark mode" feature request example with:

`"It would be great if you could remember my login across devices." → feature request`

Run message 5 again. Did the category change? This is an example of how few-shot examples shape the model's interpretation of category boundaries.

---

## Reflection questions

- For which messages did few-shot make a difference? For which was zero-shot already reliable?
- Message 8 could reasonably be either a bug report or a complaint. How would you handle genuinely ambiguous cases in a real triage system?
- What happens if your few-shot examples are inconsistently labelled?

---

## Troubleshooting

**Claude is giving me a sentence instead of just the category name**  
Add "Reply with only the category name, nothing else." to the end of your prompt. Format instructions at the end tend to be followed more reliably.

**The category changed when I swapped the example — is that a bug?**  
No, that is the point. Few-shot examples define the boundaries of each category. Different examples draw different lines.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/exercises/exercise-2-few-shot.md
git commit -m "docs: add exercise 2 (few-shot)"
```

---

### Task 7: Create exercise-3-chain-of-thought.md

**Files:**
- Create: `docs/module-prompting/exercises/exercise-3-chain-of-thought.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/exercises/exercise-3-chain-of-thought.md` with this exact content:

```markdown
# Exercise 3: Asking for Reasoning

**Goal:** See when asking for step-by-step reasoning changes a model's answer, and understand what chain-of-thought can and cannot guarantee.

**Duration:** ~15 minutes

---

## The scenario

You are reviewing job applications and you need Claude to assess a candidate against a job description. The match is deliberately ambiguous — close but not clear-cut. You will compare a direct question (zero-shot) with a reasoning-first approach (chain-of-thought).

Open a new Claude session.

---

## Step 1 — Zero-shot assessment (~3 min)

Copy the job description and candidate profile below into your session. Run this prompt:

```
Is this candidate a strong match for the role? Answer yes or no.
```

**Job description:**
> **Senior Backend Engineer — FinTech Platform**
>
> Requirements:
> - 5+ years of backend engineering experience
> - Strong proficiency in Go or Rust
> - Experience with distributed systems and microservices
> - Familiarity with financial regulations (PCI-DSS, SOC 2) preferred
> - Experience with Kubernetes and cloud-native deployments (AWS preferred)
> - Excellent communication skills — this role involves regular stakeholder presentations

**Candidate profile:**
> Jordan has 4 years of backend experience, primarily in Python and Node.js, with one year of Go. They led the migration of a monolith to microservices at their current company. Jordan has no formal experience with financial regulations but has read about PCI-DSS requirements. They are AWS Solutions Architect certified. They have not done formal stakeholder presentations but are described as "an excellent communicator" by their manager. No open source contributions.

Note the answer (yes or no) and whether Claude offered any explanation.

---

## Step 2 — Chain-of-thought assessment (~5 min)

**Start a new session.** Run this prompt with the same job description and candidate profile:

```
Is this candidate a strong match for the role? Go through each requirement one by one before giving your final answer.
```

Compare the two outputs:
- Did the yes/no answer change?
- Which output would you trust more to make a hiring decision, and why?

**Checkpoint:** Did Claude note that Jordan has only 4 years of experience against a 5-year requirement? Did it flag the difference between "has read about PCI-DSS" and "familiarity with financial regulations"?

---

## Step 3 — Push back (~7 min)

In the same session as Step 2, ask Claude to argue the opposite of its conclusion:

```
Now make the strongest possible case for the opposite answer.
```

Note whether it can do it, and how convincing the argument is.

Then add this line to your original Step 2 prompt and run it fresh in a new session:

```
After your analysis, give a confidence level: high, medium, or low, and explain what would change your assessment.
```

---

## Reflection questions

- Did chain-of-thought change the answer, or just the explanation?
- Claude's reasoning in Step 2 is not verification — it is a generated narrative that accompanies the answer. What does that imply for how you use it?
- When would you use chain-of-thought in a production prompt, versus a conversational one?

---

## Troubleshooting

**Claude gave me a paragraph answer for the zero-shot prompt even though I asked for yes or no**  
That is normal. Models rarely give a single word when the question has nuance. The point is to compare the depth and structure of reasoning between the two prompts, not the length.

**The chain-of-thought output is very long**  
That is expected. Asking for step-by-step reasoning increases output length. In production you can add: "Summarise your reasoning in two sentences after the analysis."
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/exercises/exercise-3-chain-of-thought.md
git commit -m "docs: add exercise 3 (chain-of-thought)"
```

---

### Task 8: Create exercise-4-structured-output.md

**Files:**
- Create: `docs/module-prompting/exercises/exercise-4-structured-output.md`

- [ ] **Step 1: Create the file**

Create `docs/module-prompting/exercises/exercise-4-structured-output.md` with this exact content:

```markdown
# Exercise 4: Structured Output

**Goal:** Write a prompt that reliably extracts structured data as JSON by specifying a schema and providing a one-shot example.

**Duration:** ~15 minutes

---

## The scenario

You are building a feature that ingests hotel reviews and stores structured data for analytics. You need to extract five fields consistently from unstructured review text. You will progress from a loose instruction to a schema-constrained prompt with an example.

Open a new Claude session.

---

## Step 1 — Loose extraction (~3 min)

Run this prompt with the review below:

```
Extract key information from this hotel review and return it as JSON.
```

**Hotel review:**
> Stayed at the Grand Meridian for 4 nights in May. Location is perfect — right in the city centre, walkable to all the main attractions. Check-in was smooth and staff were genuinely helpful throughout.
>
> The room itself was a bit disappointing. Comfortable bed but the aircon was noisy and kept us up the first night. Breakfast was included and the spread was impressive — easily the best hotel breakfast I've had in Europe. Small but well-equipped gym.
>
> I'd recommend this for business travellers or couples. Maybe not ideal for families with young kids — noisy corridors in the evenings and no pool.
>
> Overall a good stay. Location and breakfast make up for the minor room issues.

Note the JSON structure Claude chose. Did it match what you expected?

---

## Step 2 — Specify the schema (~5 min)

Update your prompt to specify the exact JSON shape you need:

```
Extract information from this hotel review and return JSON in exactly this format:

{
  "rating": <integer 1–5>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "highlights": [<string>, ...],
  "drawbacks": [<string>, ...],
  "recommendedFor": [<string>, ...],
  "notRecommendedFor": [<string>, ...]
}

Return only the JSON. No explanation.
```

Run it with the same review. Does the output match the schema?

**Checkpoint:** Does the JSON parse without errors? Does `recommendedFor` contain entries like `"business travellers"` or `"couples"`?

---

## Step 3 — Add a one-shot example (~7 min)

Even with a schema, models sometimes produce inconsistent types or field names. Add a one-shot example to anchor the expected output:

```
Extract information from this hotel review and return JSON in exactly this format:

{
  "rating": <integer 1–5>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "highlights": [<string>, ...],
  "drawbacks": [<string>, ...],
  "recommendedFor": [<string>, ...],
  "notRecommendedFor": [<string>, ...]
}

Example:
Review: "Great little hotel. Clean rooms, slow Wi-Fi, good for solo travellers. 3 stars."
Output:
{
  "rating": 3,
  "sentiment": "positive",
  "highlights": ["clean rooms"],
  "drawbacks": ["slow Wi-Fi"],
  "recommendedFor": ["solo travellers"],
  "notRecommendedFor": []
}

Now extract from this review:
[paste the Grand Meridian review]

Return only the JSON. No explanation.
```

Run it. Try running it three times in separate sessions. Is the output consistent?

---

## Reflection questions

- Between Step 1 and Step 3, how much did the schema and example actually change the output? What could not be constrained by the prompt alone?
- What would you do if a review genuinely did not contain enough information to fill a field?
- In a production system, what would you add after receiving Claude's JSON output?

---

## Troubleshooting

**The JSON is wrapped in a markdown code block (` ```json ``` `)**  
Add "Return only the raw JSON. No markdown formatting." to your prompt.

**The output does not parse as valid JSON**  
Check for trailing commas and unquoted strings — common model errors. In production, handle this with a retry or a schema validation library such as Zod.

**The `rating` field is a string ("4") instead of a number (4)**  
Specify the type more explicitly: `"rating": <integer between 1 and 5>`. You can also demonstrate the correct type in your one-shot example.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-prompting/exercises/exercise-4-structured-output.md
git commit -m "docs: add exercise 4 (structured output)"
```

---

## Self-review checklist

- [x] All eight files from the spec's "Files to Add or Change" table are covered
- [x] `config.ts` entry matches the spec exactly (id, title, level, audience, exercise slugs)
- [x] Test verifies the entry exists with correct metadata
- [x] `allModules` export added so the test can import it
- [x] No TBD, TODO, or placeholder content in any exercise
- [x] Troubleshooting sections are in exercise files, not in the participant guide
- [x] Participant guide contains concept primer + bullet-point exercise summaries only
- [x] Facilitator guide follows the same structure as module-1's facilitator guide
- [x] `workshop.json` is explicitly excluded (updated by facilitator, not this implementation)
