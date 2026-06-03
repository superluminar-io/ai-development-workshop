# Exercise 3: Build a Feature on the Workshop Website

**Goal:** Use the full Superpowers spec-driven process — brainstorm, spec, plan, execute — to add exercise completion tracking to the workshop website you are using right now.

**Duration:** ~30 minutes  
**Prerequisites:** Exercises 1 and 2 complete

---

## The feature

The workshop website currently has no way to track your progress. You cannot mark an exercise as done, and the home page shows no indication of how far through each module you are.

You are going to fix that. By the end of this exercise, participants will be able to mark exercises complete and see their progress on the home page.

This time you will not stop at the plan — you will implement it.

---

## Step 1 — Brainstorm the feature (~8 min)

You know this codebase. You have been using the website throughout the workshop, and you understand how it is built. That context will make your brainstorming sharper than it was for the ticket processor.

In Claude Code, describe what you want to build:

> "I want to add exercise completion tracking to the workshop website. Participants should be able to mark exercises as done and see their progress. Let's think through how this should work before touching any code."

That description matches the brainstorming skill — Claude will apply it automatically. You do not need to name the skill.

The brainstorming skill will ask questions. Keep your answers focused — you want a spec, not an open-ended discussion. Things worth thinking through:

- What does "complete" mean? Does the participant mark it manually, or does something trigger it automatically?
- Where does the state live? (There is no backend — think browser.)
- What UI shows completion? In the sidebar? On the home page module cards? Both?
- Can you un-mark an exercise? What happens if you clear your browser data?
- Does progress need to carry across sessions?

When the skill produces a spec, review it. Correct anything that does not match your intent.

<details>
<summary>Hint: The brainstorming is going too deep</summary>

Keep scope tight. You do not need animations, server sync, or user accounts. A minimal but complete feature: participants click something to mark an exercise done, the state persists in localStorage, and the sidebar shows which exercises are complete. That is enough to spec and plan in this session.

</details>

---

## Step 2 — Review the implementation plan (~5 min)

Once the spec is written and you approve it, Claude will ask if it can proceed to create an implementation plan. Say yes — the writing-plans skill runs automatically from there.

The plan will be produced without you needing to ask for it. Expect it to touch:
- A new hook or utility for reading and writing progress state
- `Sidebar.tsx` — to show completion indicators next to exercises
- `ModuleCard.tsx` — to show a progress count or progress bar on the home page
- Possibly some CSS changes in `global.css`

Read the plan. Make sure each step is concrete enough that you could follow it without guessing.

---

## Step 3 — Execute the plan (~15 min)

Once the plan is written, Claude will offer to begin executing it. Say yes and follow along.

The executing-plans skill runs automatically from the plan — you do not need to trigger it separately. Follow the skill's process. It will work through the plan task by task, running tests and checking in between steps.

Watch what it does. If it goes off-track or makes a change you did not expect, stop it and redirect — just as you did in Module 1 with refactoring. The discipline of reviewing each step applies here exactly as it did there.

<details>
<summary>Hint: The implementation is failing tests</summary>

The workshop website uses Vitest. Run `cd docs-site && npm test` to see what is failing. If a component test breaks because of a new prop or changed behaviour, read the failure carefully — it usually tells you exactly what needs updating.

</details>

---

## Step 4 — Verify it in the browser (~2 min)

Start the workshop frontend if it is not already running:

```bash
npm run docs
```

Open `http://localhost:5173`. Navigate to a module and mark an exercise complete. Then:
- Reload the page — does the completion state persist?
- Go back to the home page — does the module card show your progress?

If something is not working, check the browser console for errors.

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] A spec for the completion tracking feature
- [ ] An implementation plan
- [ ] A working implementation in the `docs-site/` frontend
- [ ] Progress visible in both the sidebar and the home page
- [ ] State persisting across page reloads

---

## Reflection questions

- How did having a spec change the way you approached the implementation?
- Did the plan match what actually needed to happen, or did you need to deviate? Why?
- You used Superpowers on a codebase you built in this workshop. How would the brainstorming have been different if you were new to the codebase?
- What would you do differently if you were building this for a production application instead of a workshop tool?
