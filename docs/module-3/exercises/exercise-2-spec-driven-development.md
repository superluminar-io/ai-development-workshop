# Exercise 2: Spec-Driven Development

**Goal:** Use the `brainstorming` and `writing-plans` skills to take a feature from idea to committed implementation plan — without writing a line of code.

**Duration:** ~25 minutes

---

## The problem with starting from code

When you ask Claude to implement a feature immediately, you are making a bet that you already understand the problem well enough. Sometimes that bet pays off. Often it does not — the implementation goes in a direction that turns out to be wrong, or you discover mid-way that the requirements were unclear, or you end up with code that works but is hard to review because no one wrote down what it was supposed to do.

Spec-driven development inverts this. You spend time thinking before touching code. The thinking produces a written spec. The spec produces a plan. The plan is reviewed and agreed before a single file is changed.

The output of this exercise is not code. It is a spec and a plan — and those are genuinely valuable deliverables.

---

## The feature

You are going to add a `feedback` category to the ticket processor. Right now the service handles `support`, `billing`, `incident`, and `security` tickets. A `feedback` ticket would represent general product feedback from customers — lower urgency than a support request, no escalation needed.

Do not open the code yet.

---

## Step 1 — Brainstorm the feature (~12 min)

In Claude Code, invoke the brainstorming skill:

> "I want to use the brainstorming skill to explore adding a `feedback` category to this ticket processor."

The brainstorming skill will ask you questions. Answer them — but keep your answers focused and concise. The goal is a written spec, not an open-ended discussion.

What the skill will explore:
- What does a `feedback` ticket represent, and who sends one?
- How should it be routed — what queue, what priority?
- What edge cases exist? What should it explicitly not cover?
- How does it fit into the existing routing table?

When the skill produces a spec, read it carefully. Does it match your intent? If something is wrong, say so — the skill will revise.

<details>
<summary>Hint: The brainstorming skill is asking me too many questions</summary>

The brainstorming skill is designed to be thorough. For this exercise, you do not need to explore every angle — you need a spec for one small, well-bounded feature. It is fine to say: "Let's keep the scope narrow. I just need the routing rules and the queue assignment. Please produce a spec with those two things."

</details>

---

## Step 2 — Review the spec (~3 min)

Read the spec the brainstorming skill produced. Check:

- Is the routing behaviour clearly defined? (what priority, what queue)
- Are the edge cases explicit?
- Is there anything missing that would block an engineer from implementing this without asking questions?

A good spec should be specific enough that two different engineers, reading it independently, would build the same thing.

---

## Step 3 — Create an implementation plan (~8 min)

Now invoke the `writing-plans` skill:

> "Use the writing-plans skill to create an implementation plan for the feedback ticket category spec we just produced."

The skill will read the spec and produce a step-by-step plan: which files to touch, what changes to make in each, what tests to write, and in what order.

Read the plan. Notice:
- Each step is concrete — not "add validation" but "add `'feedback'` to the `category` union type in `src/domain/ticket.ts`"
- The plan is reviewable — a colleague could read it and ask questions before any code is written
- The plan is a commit-ready document — it can be version-controlled alongside the spec

---

## Step 4 — See the pattern in this repo (~2 min)

Open `docs/superpowers/` in your editor.

You will find:
- `specs/` — written specs produced by the brainstorming skill
- `plans/` — implementation plans produced by the writing-plans skill

This workshop was built using exactly this process. The specs and plans are what the people building it thought through before writing any code, docs, or configuration. The files you are reading right now were produced by this pattern.

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] A spec for the `feedback` ticket category produced by the brainstorming skill
- [ ] An implementation plan produced by the writing-plans skill
- [ ] An understanding of why the plan is a deliverable, not just a step on the way to code

You have not changed any source files. That is intentional.

---

## Reflection questions

- What did the brainstorming skill surface that you had not thought of yourself?
- How does having a written plan change the code review conversation?
- If you handed this plan to a colleague right now, could they implement it without asking you questions?
- What parts of your current engineering process could benefit from a written spec before implementation?
