# Exercise 1: Plugins and Superpowers

**Goal:** Install the Superpowers plugin, understand what it adds, and connect it to the skill you wrote in Module 1.

**Duration:** ~20 minutes  
**Prerequisites:** Module 1 complete, `.claude/skills/safe-refactoring.md` in your repo

---

## What is a Claude Code plugin?

A plugin is an installable package that extends Claude Code. Plugins can add:
- **Skills** — structured instruction sets Claude applies when the situation matches
- **Commands** — additional slash commands available in your session
- **Tools** — capabilities Claude can invoke during a conversation

Plugins are distributed through the Claude plugin registry and installed once per user. They are not project-specific — once installed, a plugin's skills and commands are available in every Claude Code session.

Superpowers is an official plugin maintained by Anthropic. It adds a library of skills for common engineering tasks: brainstorming feature ideas, writing specs, creating implementation plans, debugging systematically, reviewing code, and more.

---

## Step 1 — Install Superpowers (~3 min)

In Claude Code, run:

```
/plugin install superpowers@claude-plugins-official
```

Claude will install the plugin and confirm when it is ready. You may need to restart Claude Code after installation — if prompted, do so.

Verify the installation:

```
/plugin list
```

Expected: `superpowers` appears in the list with its version.

<details>
<summary>Hint: /plugin install command not found</summary>

Run `claude --version` to check your version. The `/plugin` command requires Claude Code 1.x or later. If the command is unrecognised, update Claude Code: `npm install -g @anthropic-ai/claude-code`.

</details>

<details>
<summary>Hint: Superpowers skills are not appearing</summary>

Restart Claude Code after installing. Then ask: "What Superpowers skills do you have access to?" If the list is empty, the plugin may not have loaded — check with the facilitator.

</details>

---

## Step 2 — Explore available skills (~5 min)

Ask Claude:

> "What Superpowers skills do you have access to? Give me a brief list."

Read the list. Notice:
- There are skills for different phases of work: exploring, planning, implementing, reviewing
- Each skill has a name and a description of when to use it
- Some skills are marked as processes that involve multiple steps or back-and-forth conversation

Ask about one that interests you:

> "When would I use the `brainstorming` skill? What does it actually do?"

---

## Step 3 — Compare to your Module 1 skill (~8 min)

Open `.claude/skills/safe-refactoring.md` in your editor (or `.claude/skills/safe-refactoring/SKILL.md` depending on how you created it). Then ask Claude to show you the content of the `brainstorming` Superpowers skill:

<details>
<summary>Hint: I cannot find my safe-refactoring skill from Module 1</summary>

Check `.claude/skills/` in your workshop repo. If you did not complete Exercise 2 in Module 1, write a minimal version now: create `.claude/skills/safe-refactoring/SKILL.md` with a `name`, `description`, and a numbered list of steps.

</details>

> "Show me the content of the brainstorming skill file."

Read both. Notice what is the same and what is different:

**Same:**
- Both are markdown files with YAML frontmatter
- Both have a `name` and a `description`
- Both contain structured instructions for Claude to follow

**Different:**
- Superpowers skills have a richer frontmatter: `when_to_use`, checklists, process flows
- Superpowers skills are maintained by a team and refined over time
- Superpowers skills can reference other skills and chain together

The concept you learned in Module 1 — a markdown file that tells Claude how to approach a situation — is exactly the same concept. Superpowers is the community-maintained, professionally structured version of it.

---

## Step 4 — Understand how skills trigger (~4 min)

Superpowers skills work exactly the same way as the skill you wrote in Module 1. Claude reads the `description` field in the frontmatter and applies the skill automatically when your message matches it — you do not invoke skills explicitly. You just describe what you need in natural language.

Look at the brainstorming skill's description again:

> *"You MUST use this before any creative work — creating features, building components, adding functionality, or modifying behavior."*

If you send Claude a message like "I want to add a new feature to this service," that matches the brainstorming description and Claude will apply the skill. You do not need to name the skill. You do not need to ask for it. You just say what you want to do.

This is identical to how your `safe-refactoring.md` works. When you tell Claude "I want to refactor this handler," it matches the description and applies the skill. The only difference between your skill and a Superpowers skill is where the file lives and how carefully it was written.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] Superpowers installed and verified
- [ ] A list of available skills from the plugin
- [ ] A side-by-side comparison of your Module 1 skill and a Superpowers skill
- [ ] A clear understanding that all skills — yours and Superpowers — trigger the same way: through natural language, not explicit invocation

---

## Reflection questions

- What is the difference between a skill you write for your project and one that comes from a plugin?
- Why might a team want to maintain shared skills in a plugin rather than in a project's `.claude/skills/` directory?
- Which Superpowers skill would be most useful in your day-to-day work right now?
