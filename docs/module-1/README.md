# Module 1: Claude Code in the Engineering Loop

**Duration:** ~60 minutes  
**Type:** Hands-on exercises  

## What you will practise

- Using Claude Code to explore and understand an unfamiliar TypeScript codebase
- Reading and modifying `CLAUDE.md` project instructions to constrain Claude's behaviour
- Writing a custom Claude Code slash command
- Asking Claude for a plan before making changes
- Introducing stronger types and Zod validation in small, reviewable steps
- Running tests after each change and inspecting `git diff` before accepting work
- Using Claude to identify missing test coverage and find a real bug
- Preparing a PR-style summary with Claude

## Routing rules

The service routes tickets to named queues based on category and amount:

| Category  | Condition        | Priority | Queue              |
|-----------|------------------|----------|--------------------|
| incident  | any              | high     | escalation-queue   |
| security  | any              | escalate | escalation-queue   |
| billing   | amount > 1000    | escalate | escalation-queue   |
| billing   | amount ≤ 1000    | medium   | billing-queue      |
| support   | any              | low      | standard-queue     |

> **Note:** The starter code does not fully implement this table. Part of the workshop is discovering where it diverges.

## Exercises

1. [Exercise 1: Codebase Orientation](exercises/exercise-1-orientation.md)
2. [Exercise 2: Safe Refactoring](exercises/exercise-2-refactoring.md)
3. [Exercise 3: Tests, Review, and PR Prep](exercises/exercise-3-tests-and-review.md)

Or follow the [Participant Guide](participant-guide.md) for the full step-by-step walkthrough.

## Prerequisites

- Node.js 20+
- Claude Code CLI installed and authenticated
- `npm install` run in the repo root
- A terminal and a code editor open on this repo
