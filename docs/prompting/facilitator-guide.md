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

Use the wrap-up to preview Module 1:

"Everything you practised here — specificity, constraints, output format, iteration — is what you will use in Module 1 when you are working inside a real codebase. The context is larger and the stakes are higher. The same principles apply."

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
