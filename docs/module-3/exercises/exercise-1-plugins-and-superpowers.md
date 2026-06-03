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

Open `.claude/skills/safe-refactoring.md` in your editor. Then ask Claude to show you the content of the `brainstorming` Superpowers skill:

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

## Step 4 — Understand how skills are invoked (~4 min)

In Module 1, CLAUDE.md told Claude to scan `.claude/skills/` and apply matching skills based on their `description`. Superpowers skills work differently: they are invoked explicitly using the `Skill` tool inside Claude Code.

Ask Claude:

> "How do I invoke a Superpowers skill?"

The key distinction:
- **Your skills** (`.claude/skills/`) — Claude recognises and applies them automatically based on context
- **Superpowers skills** — you invoke them deliberately when you decide the task warrants a structured approach

Neither is better. They serve different purposes. Your skills encode how Claude should approach tasks in your specific project. Superpowers skills encode how to run a structured engineering process.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] Superpowers installed and verified
- [ ] A list of available skills from the plugin
- [ ] A side-by-side comparison of your Module 1 skill and a Superpowers skill
- [ ] A clear understanding of when to use each invocation style

---

## Reflection questions

- What is the difference between a skill you write for your project and one that comes from a plugin?
- Why might a team want to maintain shared skills in a plugin rather than in a project's `.claude/skills/` directory?
- Which Superpowers skill would be most useful in your day-to-day work right now?
