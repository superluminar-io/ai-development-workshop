#!/usr/bin/env bash
set -euo pipefail

# Creates the GitHub issue and PR used in MCP module exercises.
# Run this once after pushing the workshop repo to your own GitHub account.
#
# Prerequisites:
#   - gh auth login completed
#   - run from the root of the workshop repo

echo "Setting up MCP module demo scenario..."

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
if [ -z "$REPO" ]; then
  echo "Error: could not detect a GitHub remote. Make sure you have pushed this repo to GitHub and run 'gh auth login'." >&2
  exit 1
fi
echo "Using repo: $REPO"

# Check the demo branch exists
if ! git show-ref --quiet refs/remotes/origin/demo/vip-routing; then
  echo "Error: branch 'demo/vip-routing' not found on origin. Make sure you have pushed all branches: git push origin demo/vip-routing" >&2
  exit 1
fi

# Create the issue
ISSUE_URL=$(gh issue create \
  --repo "$REPO" \
  --title "VIP routing: constraints for incident and security tickets" \
  --body "## Background

We are adding a VIP fast-track queue for platinum-tier customers. Before this ships, there is one constraint that must be enforced:

## Constraint

**VIP routing must NOT apply to incident or security tickets.**

Incident and security tickets already have a dedicated escalation path. If a platinum customer files a security ticket and it gets routed to \`vip-queue\` instead of \`escalation-queue\`, the incident response team will not see it. This has happened before with high-priority routing overrides and caused a delayed response.

The rule: if \`category\` is \`incident\` or \`security\`, always use the standard escalation path regardless of \`vipTier\`.

## Acceptance criteria

- Platinum VIP billing and support tickets → \`vip-queue\`
- Platinum VIP incident tickets → \`escalation-queue\` (same as non-VIP)
- Platinum VIP security tickets → \`escalation-queue\` (same as non-VIP)
")

ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -o '[0-9]*$')
echo "Created issue #$ISSUE_NUMBER: $ISSUE_URL"

# Create the PR
PR_URL=$(gh pr create \
  --repo "$REPO" \
  --title "feat: add VIP customer routing" \
  --base main \
  --head demo/vip-routing \
  --body "## Summary

Adds priority routing for platinum-tier VIP customers. When a ticket has \`vipTier: 'platinum'\`, it bypasses standard classification and is routed directly to \`vip-queue\` for priority handling.

Closes #$ISSUE_NUMBER

## Changes

- Added \`vipTier\` field to \`Ticket\` type
- \`routeTicket\` checks for VIP tier before applying standard routing logic
- Input handler passes through \`vipTier\` from the raw input

## Testing

Added a test confirming that platinum VIP tickets are routed to \`vip-queue\`. All existing tests continue to pass.
")

echo "Created PR: $PR_URL"
echo ""
echo "Setup complete. Use this repo in your MCP module exercises:"
echo "  $REPO"
