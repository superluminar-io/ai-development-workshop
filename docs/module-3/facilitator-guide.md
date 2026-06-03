# Module 3 Facilitator Guide

**Plugins, Superpowers, and Spec-Driven Development**

---

## Learning goals

By the end of this module participants should be able to:

1. Explain what a Claude Code plugin is and how it extends Claude's capabilities
2. Install and verify a plugin using `/plugin install`
3. Distinguish between skills (contextual, applied by situation) and commands (explicit invocation)
4. Use the `brainstorming` skill to produce a written spec from a feature description
5. Use the `writing-plans` skill to turn a spec into a step-by-step implementation plan
6. Explain why the plan is itself a deliverable — and why stopping before implementation is intentional
7. Upgrade a simple `.claude/skills/` file to Superpowers frontmatter format

**The meta-skill:** understanding that the process of thinking before coding is a discipline, not just advice — and that tools like Superpowers make that discipline repeatable and shareable.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Modules 1 and 2 + intro | 5 min |
| Exercise 1 | 20 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 25 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 15 min |
| Debrief + wrap-up | 5 min |
| **Total** | **~80 min** |

---

## Before the session

No external repo setup is needed for this module. Participants work in their own workshop repo throughout.

Verify that Superpowers is available in the plugin registry before the session:

```
/plugin install superpowers@claude-plugins-official
```

Run this yourself and confirm it installs cleanly. If the registry is unavailable, have a fallback plan (e.g. share skill files directly).

---

## Exercise 1 facilitation notes

**The comparison moment is the key teaching point.** When participants open a Superpowers skill file and compare it to their own `safe-refactoring.md`, most will see it as a more elaborate version of the same thing — which is exactly right. Reinforce this: they already understood the concept in Module 1. Superpowers is the community-maintained, battle-tested version of that same idea.

**Common confusion:** participants sometimes expect Superpowers to do something dramatic. Manage expectations early — it adds structured skills, not magic. The value is in the quality and specificity of those skills, not the installation itself.

---

## Exercise 2 facilitation notes

**This is the conceptual centrepiece of the module.** Spec-driven development is unfamiliar to most engineers — the instinct is to start coding immediately. The exercise is designed to create a moment of recognition: "I've been doing this backwards."

**Keep the scope tight.** The feature (adding a `feedback` ticket category) is deliberately small. If participants try to expand it during brainstorming, redirect them: "We're not designing the whole system — just this one change."

**The `docs/superpowers/` anchor is powerful.** Pointing at the specs and plans that built this workshop is the most concrete way to show that spec-driven development produces real output. Let participants browse those files for a few minutes.

**The plan is the deliverable.** Participants who reach the end of `writing-plans` and want to immediately implement the plan are showing exactly the right instinct — but stop them. The point of the exercise is to see that the plan itself has value: it can be reviewed, revised, handed to a colleague, or shelved. Implementation is a separate decision.

---

## Exercise 3 facilitation notes

This is the lightest exercise. Its purpose is to close the loop from Module 1 (simple skills) to Superpowers (richer skills) and to plant the idea of skill distribution.

**The distribution hierarchy** (personal → project → plugin) mirrors how most organisational knowledge works: individual → team → company. Draw that parallel explicitly if time allows.

---

## Simplifications

If time is short, Exercise 3 can be cut — the core learning of the module is in Exercises 1 and 2. Exercise 3 is consolidation.

If the plugin registry is unavailable, Exercise 1 can be run by sharing a Superpowers skill file directly and asking participants to read it — the installation step is not essential to the learning.

---

## Connection to the broader arc

Across the three modules, participants have moved through three levels of working with Claude Code:

- **Module 1:** Ad-hoc to disciplined — commands, skills, review loop
- **Module 2:** Local to connected — MCP, external context, shared commands
- **Module 3:** Reactive to proactive — spec-driven development, community skills, structured process

Each module builds on the last. By Module 3, participants have the vocabulary and habits to use Superpowers productively rather than just treating it as a collection of useful tricks.
