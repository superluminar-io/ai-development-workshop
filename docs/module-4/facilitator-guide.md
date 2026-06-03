# Module 4 Facilitator Guide

**The AI Harness — Claude Code for Teams and Organisations**

---

## Learning goals

By the end of this module participants should be able to:

1. Articulate the difference between individual Claude Code configuration and team-level governance
2. Add team-facing governance rules to a project CLAUDE.md and explain why they differ from individual rules
3. Configure a permissions allow/deny list in `.claude/settings.json` and explain the difference between CLAUDE.md guidance and hard permission limits
4. Write a `PostToolUse` hook and explain when hooks are the right tool versus CLAUDE.md rules
5. Extract a reusable harness template another team could adopt on day one
6. Explain the harness as an engineering asset — something teams own, review, and evolve

**The meta-skill:** Claude Code is a configurable system, not a fixed tool. The configuration is shared infrastructure. It belongs in version control, goes through code review, and should improve over time.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Modules 1–3 + intro to team context | 5 min |
| Exercise 1 | 25 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 20 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 15 min |
| Debrief + wrap-up | 5 min |
| **Total** | **~80 min** |

---

## Before the session

No external setup needed. Participants work in their own workshop repo throughout. Verify that `.claude/settings.json` does not already exist in the repo — if it does (from a previous session), clear its contents before the module starts.

---

## Exercise 1 facilitation notes

**The key teaching moment is the distinction between CLAUDE.md and permissions.** Many participants will assume that writing a rule in CLAUDE.md is equivalent to enforcing it. The moment they ask Claude to run a denied command and watch it refuse — without prompting, without negotiation — is when the distinction lands.

Ask participants: "Could you write a prompt that would make Claude run `git push --force` anyway?" The answer should be no — and that is the point.

**Common confusion:** participants sometimes add deny rules but forget to restart Claude Code. Hooks and permissions are loaded at session start. Remind them that editing `settings.json` mid-session requires a restart.

---

## Exercise 2 facilitation notes

**The hook explanation in the exercise body is intentional.** Hooks are not intuitive. The exercise asks participants to read the explanation before configuring anything. Do not rush past it.

**The test failure demonstration is the payoff.** When participants ask Claude to make a breaking change and the hook fires — showing test failures they didn't ask for — the value proposition becomes concrete. Facilitate a brief discussion: "How would this have played out without the hook?"

**Slow tests are a real concern.** If participants raise this (and they will), validate it. `npm test` for this repo is fast. In a real project with a long test suite, the right answer is a faster hook (linter, type check) with full tests in CI. The hook demonstrates the mechanism; the production decision is context-dependent.

---

## Exercise 3 facilitation notes

This is the synthesis exercise. Participants are not learning a new concept — they are packaging what they have built into something distributable.

**The README is the most important deliverable.** A `settings.json` with no explanation is opaque. A team that copies the template and does not understand the `deny` list will either remove it or resent it. The README is what makes the template adoptable.

**End with the governance question.** Who owns the harness? Individual teams, or a central platform team? There is no right answer, but the question surfaces real organisational dynamics. It is a good discussion to close the module with.

---

## Connection to the broader arc

| Module | Individual focus | Org focus added |
|--------|-----------------|-----------------|
| 1 | Commands, skills, review loop | — |
| 2 | MCP, external context | Shared commands in the repo |
| 3 | Spec-driven development | Shared plugins and skills |
| 4 | — | Permissions, hooks, org template |

Module 4 completes the arc: the practices participants built for themselves are now things the whole organisation can share, enforce, and evolve.

---

## Simplifications

If time is short, Exercise 3 can be cut — it is synthesis, not new concepts. The core learning is in Exercises 1 and 2.

If participants struggle with JSON syntax in `settings.json`, have them validate with:
```bash
cat .claude/settings.json | python3 -m json.tool
```
