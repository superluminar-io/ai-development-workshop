import workshopConfigJson from '../../workshop.json'

export interface Exercise {
  slug: string
  title: string
  file: string // Vite-served URL path, e.g. /docs/module-1/exercises/exercise-1-orientation.md
  audience?: 'engineer' | 'business' | 'both'
}

export interface Module {
  id: string
  number: string
  title: string
  description: string
  status: 'ready' | 'coming-soon'
  participantGuide: string // Vite-served URL path, e.g. /docs/module-1/participant-guide.md
  exercises: Exercise[]
  level: 'foundations' | 'advanced'
  audience: 'engineer' | 'business' | 'both'
}

export interface Track {
  id: string
  label: string
  audience: 'engineer' | 'business' | 'both'
  modules: Module[]
  summary?: string
}

type RawTrack = {
  id: string
  label: string
  audience: 'engineer' | 'business' | 'both'
  modules: string[]
  summary?: string
}

type WorkshopConfig =
  | { modules: string[] }
  | { tracks: RawTrack[] }

const workshopConfig = workshopConfigJson as unknown as WorkshopConfig

export function filterModules(all: Module[], enabledIds: string[]): Module[] {
  return all.filter((m) => enabledIds.includes(m.id))
}

export function assignDisplayNumbers(mods: Module[]): Module[] {
  let counter = 0
  return mods.map((m) => ({
    ...m,
    number: m.id === 'setup' ? m.number : String(++counter).padStart(2, '0'),
  }))
}

export function filterExercises(
  exercises: Exercise[],
  audience: 'engineer' | 'business' | 'both'
): Exercise[] {
  if (audience === 'both') return exercises
  return exercises.filter(
    (ex) => !ex.audience || ex.audience === audience || ex.audience === 'both'
  )
}

export function resolveTracks(config: WorkshopConfig, allMods: Module[]): Track[] {
  if ('modules' in config) {
    return [
      {
        id: 'default',
        label: 'Workshop',
        audience: 'both',
        modules: assignDisplayNumbers(filterModules(allMods, config.modules)),
      },
    ]
  }
  return config.tracks.map((raw) => ({
    id: raw.id,
    label: raw.label,
    audience: raw.audience,
    summary: raw.summary,
    modules: assignDisplayNumbers(
      filterModules(allMods, raw.modules).map((m) => ({
        ...m,
        exercises: filterExercises(m.exercises, raw.audience),
      }))
    ),
  }))
}

export const allModules: Module[] = [
  {
    id: 'setup',
    number: '00',
    title: 'Environment Setup',
    description: 'Install Node.js, Claude Code, and verify the service runs before starting the exercises.',
    status: 'ready',
    participantGuide: '/docs/setup/participant-guide.md',
    exercises: [],
    level: 'foundations',
    audience: 'both',
  },
  {
    id: 'module-1',
    number: '01',
    title: 'Claude Code in the Engineering Loop',
    description:
      'Explore a codebase, refactor safely, write tests, and prepare a PR summary — all with Claude.',
    status: 'ready',
    participantGuide: '/docs/module-1/participant-guide.md',
    level: 'foundations',
    audience: 'engineer',
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
    level: 'foundations',
    audience: 'engineer',
    exercises: [
      {
        slug: 'exercise-1-review-without-context',
        title: 'Configure GitHub MCP and Review a PR',
        file: '/docs/module-2/exercises/exercise-1-review-without-context.md',
      },
      {
        slug: 'exercise-2-github-mcp',
        title: 'Upgrade the review-pr Command',
        file: '/docs/module-2/exercises/exercise-2-github-mcp.md',
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
    level: 'foundations',
    audience: 'engineer',
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
    level: 'foundations',
    audience: 'engineer',
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
  {
    id: 'module-5',
    number: '05',
    title: 'AI Security & Guardrails',
    description:
      'Defend against prompt injection, lock down file access with deny rules, and run Claude safely in automated pipelines.',
    status: 'ready',
    participantGuide: '/docs/module-5/participant-guide.md',
    level: 'advanced',
    audience: 'engineer',
    exercises: [
      {
        slug: 'exercise-1-prompt-injection',
        title: 'Prompt Injection in the Engineering Loop',
        file: '/docs/module-5/exercises/exercise-1-prompt-injection.md',
      },
      {
        slug: 'exercise-2-secrets-permissions',
        title: 'Secrets and the Permission Layer',
        file: '/docs/module-5/exercises/exercise-2-secrets-permissions.md',
      },
      {
        slug: 'exercise-3-safe-agentic-patterns',
        title: 'Safe Agentic Patterns',
        file: '/docs/module-5/exercises/exercise-3-safe-agentic-patterns.md',
      },
    ],
  },
  {
    id: 'module-prompting',
    number: '06',
    title: 'Communicating with AI',
    description:
      'Learn how LLMs process text, practise the core prompt patterns, and iterate on prompts that don\'t work.',
    status: 'ready',
    participantGuide: '/docs/module-prompting/participant-guide.md',
    level: 'foundations',
    audience: 'engineer',
    exercises: [
      {
        slug: 'exercise-1-vague-to-precise',
        title: 'From Vague to Precise',
        file: '/docs/module-prompting/exercises/exercise-1-vague-to-precise.md',
      },
      {
        slug: 'exercise-2-few-shot',
        title: 'Teaching by Example',
        file: '/docs/module-prompting/exercises/exercise-2-few-shot.md',
      },
      {
        slug: 'exercise-3-chain-of-thought',
        title: 'Asking for Reasoning',
        file: '/docs/module-prompting/exercises/exercise-3-chain-of-thought.md',
      },
      {
        slug: 'exercise-4-structured-output',
        title: 'Structured Output',
        file: '/docs/module-prompting/exercises/exercise-4-structured-output.md',
      },
    ],
  },
]

export const tracks: Track[] = resolveTracks(workshopConfig, allModules)
export const activeTrack: Track | null = tracks[0] ?? null
export const modules: Module[] = activeTrack?.modules ?? []
