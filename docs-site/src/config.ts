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
        slug: 'exercise-2-refactoring',
        title: 'Safe Refactoring',
        file: '/docs/module-1/exercises/exercise-2-refactoring.md',
      },
      {
        slug: 'exercise-3-tests-and-review',
        title: 'Tests, Review & PR Prep',
        file: '/docs/module-1/exercises/exercise-3-tests-and-review.md',
      },
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'From Prompts to Repeatable AI Workflows',
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
]
