export interface Exercise {
  slug: string
  title: string
  file: string // Vite-served URL path, e.g. /docs/module-1/exercises/exercise-1-orientation.md
}

export interface Module {
  id: string
  number: string
  title: string
  description: string
  status: 'ready' | 'coming-soon'
  participantGuide: string // Vite-served URL path, e.g. /docs/module-1/participant-guide.md
  exercises: Exercise[]
}

export const modules: Module[] = [
  {
    id: 'setup',
    number: '00',
    title: 'Environment Setup',
    description: 'Install Node.js, Claude Code, and verify the service runs before starting the exercises.',
    status: 'ready',
    participantGuide: '/docs/setup/participant-guide.md',
    exercises: [],
  },
  {
    id: 'module-1',
    number: '01',
    title: 'Claude Code in the Engineering Loop',
    description:
      'Explore a codebase, refactor safely, write tests, and prepare a PR summary — all with Claude.',
    status: 'ready',
    participantGuide: '/docs/module-1/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-orientation',
        title: 'Codebase Orientation',
        file: '/docs/module-1/exercises/exercise-1-orientation.md',
      },
      {
        slug: 'exercise-2-writing-a-skill',
        title: 'Writing a Skill',
        file: '/docs/module-1/exercises/exercise-2-writing-a-skill.md',
      },
      {
        slug: 'exercise-3-refactoring',
        title: 'Safe Refactoring',
        file: '/docs/module-1/exercises/exercise-3-refactoring.md',
      },
      {
        slug: 'exercise-4-tests-and-review',
        title: 'Tests, Review & PR Prep',
        file: '/docs/module-1/exercises/exercise-4-tests-and-review.md',
      },
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'Code Review, Context, and Commands',
    description:
      'Configure GitHub MCP, review PRs with full context, and build reusable slash commands.',
    status: 'ready',
    participantGuide: '/docs/module-2/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-review-without-context',
        title: 'Review Without Context',
        file: '/docs/module-2/exercises/exercise-1-review-without-context.md',
      },
      {
        slug: 'exercise-2-github-mcp',
        title: 'GitHub MCP Setup',
        file: '/docs/module-2/exercises/exercise-2-github-mcp.md',
      },
      {
        slug: 'exercise-3-reusable-command',
        title: 'Build a Reusable Command',
        file: '/docs/module-2/exercises/exercise-3-reusable-command.md',
      },
    ],
  },
  {
    id: 'module-3',
    number: '03',
    title: 'Plugins, Superpowers, and Spec-Driven Development',
    description:
      'Install the Superpowers plugin, explore community-built skills, and use spec-driven development to take a feature from idea to implementation plan.',
    status: 'ready',
    participantGuide: '/docs/module-3/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-plugins-and-superpowers',
        title: 'Plugins and Superpowers',
        file: '/docs/module-3/exercises/exercise-1-plugins-and-superpowers.md',
      },
      {
        slug: 'exercise-2-spec-driven-development',
        title: 'Spec-Driven Development',
        file: '/docs/module-3/exercises/exercise-2-spec-driven-development.md',
      },
      {
        slug: 'exercise-3-superpowers-skill',
        title: 'Build a Feature on the Workshop Website',
        file: '/docs/module-3/exercises/exercise-3-superpowers-skill.md',
      },
    ],
  },
  {
    id: 'module-4',
    number: '04',
    title: 'The AI Harness — Claude Code for Teams and Organisations',
    description:
      'Configure team governance, permissions, and hooks. Build a reusable org template for Claude Code standards.',
    status: 'ready',
    participantGuide: '/docs/module-4/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-team-harness',
        title: 'Team Lead: Establish the Team Harness',
        file: '/docs/module-4/exercises/exercise-1-team-harness.md',
      },
      {
        slug: 'exercise-2-hooks',
        title: 'Team Lead: Automate the Enforcement',
        file: '/docs/module-4/exercises/exercise-2-hooks.md',
      },
      {
        slug: 'exercise-3-org-template',
        title: 'Head of AI Engineering Practices: Build the Org Template',
        file: '/docs/module-4/exercises/exercise-3-org-template.md',
      },
    ],
  },
]
