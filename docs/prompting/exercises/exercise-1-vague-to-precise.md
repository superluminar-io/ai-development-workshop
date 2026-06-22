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
