# Module 3 Participant Guide

**Plugins, Superpowers, and Spec-Driven Development**

> Modules 1 and 2 must be complete before starting here.

---

## The scenario

You've been at the company for a few weeks. You're comfortable with Claude Code — you can navigate an unfamiliar codebase, write commands, configure MCP, and write skills that Claude applies automatically. But your AI-assisted development is still reactive: you describe a problem, Claude responds, you review it. There's no systematic process for going from a feature idea to something you'd confidently hand to a colleague.

A colleague mentions Superpowers — a plugin that formalises exactly this. You install it, discover what it adds, and use it to take a small feature from first conversation to a committed implementation plan.

---

## What is a plugin?

A Claude Code plugin is an installable package that extends what Claude can do in your project. Plugins can add skills, commands, tools, and configuration. They are distributed through the Claude plugin registry and installed with a single command.

Superpowers is an official plugin that adds a library of structured skills for common engineering tasks — brainstorming, spec writing, implementation planning, code review, debugging, and more. These skills are the professional version of the skill you wrote in Module 1: same concept, richer structure, and built by people who have thought carefully about what good AI-assisted engineering looks like.

---

## Exercise 1 — Plugins and Superpowers (~20 min)

Install the Superpowers plugin, explore what it adds, and understand how its skills relate to the skill you wrote in Module 1. [Full instructions →](exercises/exercise-1-plugins-and-superpowers.md)

> **In the scenario:** You've heard about Superpowers from a colleague. Before you use it, you want to understand what it actually is — not just install it blindly. You read a skill file, compare it to your own, and understand exactly what Claude is being given access to.

---

## Exercise 2 — Spec-Driven Development (~25 min)

Use the `brainstorming` and `writing-plans` skills to take a feature from idea to committed implementation plan — without writing a line of code. [Full instructions →](exercises/exercise-2-spec-driven-development.md)

> **In the scenario:** Your manager asks you to add a `feedback` category to the ticket processor. Your instinct is to open the code immediately. Instead, you use Superpowers to explore the idea first — and discover that the five minutes of upfront thinking saves you from implementing the wrong thing.

---

## Exercise 3 — Build a Feature on the Workshop Website (~30 min)

Use the full Superpowers spec-driven process — brainstorm, spec, plan, execute — to add exercise completion tracking to the workshop website you are using right now. [Full instructions →](exercises/exercise-3-superpowers-skill.md)

> **In the scenario:** You have now seen the full process: brainstorm a problem, write a spec, create a plan, implement it. This time you apply it to something you own — the workshop website — and you take it all the way from idea to working feature.

---

## Troubleshooting

**`/plugin install` command not found**  
Make sure you are running Claude Code version 1.x or later. Run `claude --version` to check.

**Superpowers skills are not appearing**  
After installing, restart Claude Code. Then ask: "What Superpowers skills do you have access to?" If the list is empty, the plugin may not have loaded — check with the facilitator.

**The brainstorming skill is taking a long time**  
The brainstorming skill is conversational. If it asks you a question, answer it concisely and keep moving. The goal is a spec file, not an exhaustive exploration.

**I cannot find my `safe-refactoring.md` from Module 1**  
Check `.claude/skills/` in your workshop repo. If you did not complete Exercise 2 in Module 1, write a minimal version now: create the file with `name`, `description`, and a numbered list of steps.
