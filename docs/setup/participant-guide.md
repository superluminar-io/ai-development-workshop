# Setup

Get your environment ready before starting Module 1.

---

## Prerequisites

You need these installed before the workshop:

- **Node.js 20+** — check with `node --version`
- **Claude Code CLI** — check with `claude --version`
- **A code editor** for example, vscode
- **A terminal**

If Claude Code is not installed, run:
```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:
```bash
claude
```

Follow the prompts to log in.

---

## Clone the repository

Create a local directory and clone the workshop repository using the URL shared by your facilitator:

```bash
git clone <workshop-repo-url>
cd <repo-name>
```

Open the repository in your code editor before continuing.

---

## Set up your GitHub repository

You need your own copy of this repository on GitHub. Having your own remote means you will not accidentally push changes to the workshop repo, and some exercises require it.

### 1 — Create a new empty repository on GitHub

1. Sign in to [github.com](https://github.com)
2. Click the **+** icon in the top-right corner and select **New repository** ([GitHub docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository))
3. Give it any name (e.g. `ai-workshop`) — setup scripts detect your repo from the git remote automatically, so the name does not matter
4. Set visibility to public or private — your choice
5. **Do not** initialise with a README, .gitignore, or licence — the repository must be empty
6. Click **Create repository** and note the URL shown on the next page

### 2 — Replace the remote with your own repository

Remove the existing `origin` (which points to the superluminar organisation) and add your own ([GitHub docs](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)):

```bash
git remote remove origin

# SSH (recommended if your GitHub account uses SSH keys)
git remote add origin git@github.com:<your-username>/<your-repo-name>.git

# HTTPS (if unsure, use this)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

Verify the change:

```bash
git remote -v
```

`origin` should now point to your repository only.

### 3 — Push to your repository

```bash
git push -u origin main
git push origin demo/vip-routing
```

`demo/vip-routing` is required by some exercise setup scripts.

---

## Verify the service works

Run these commands from the repository root:

```bash
npm install
npm test           # should show 14 tests passing
npm run typecheck  # should show 0 errors
npm run process:example  # should print a ticket result
```

If any of these fail, ask for help before starting Module 1.

---

## You're ready

Go to Module 1 in the sidebar to begin.
