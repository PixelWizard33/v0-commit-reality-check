export type RoastIntensity = "friendly" | "classic" | "savage" | "existential"

export interface CommitRoast {
  original: string
  roast: string
}

export interface TranslatorOutput {
  whatYouWrote: string
  whatPMHears: string
  whatFutureYouHears: string
  whatProductionFeels: string
}

export interface RealityCheck {
  original: string
  unclear: string
  missing: string
  suggestedRewrite: string
}

export interface AnalysisResult {
  chaosScore: number
  archetype: string
  debugPainRating: string
  roasts: CommitRoast[]
  translations: TranslatorOutput[]
  realityChecks: RealityCheck[]
}

const archetypes = [
  "The Chaos Agent",
  "The Mystery Novelist",
  "The Time Bomb",
  "The Wishful Thinker",
  "The Copy-Paster",
  "The Overconfident Shipper",
  "The Midnight Committer",
  "The Git Goblin",
  "The YOLO Deployer",
  "The 'It Works on My Machine' Dev",
]

const debugPainRatings = [
  "Mild headache in 2 weeks",
  "Full migraine by next sprint",
  "Team therapy recommended",
  "Career-ending git blame",
  "Your future self will quit",
  "Stack Overflow won't save you",
  "Ctrl+Z won't fix this",
  "Hot fix at 3 AM guaranteed",
  "Incident report incoming",
  "Resume update recommended",
]

const friendlyRoasts: Record<string, string[]> = {
  default: [
    "Ah, a commit message only its creator could love.",
    "This is... creative! In a modern art kind of way.",
    "Your commit messages have a certain enigmatic charm.",
    "I'm sure this made perfect sense at the time!",
    "This commit has big 'trust me bro' energy.",
  ],
}

const classicRoasts: Record<string, string[]> = {
  default: [
    "This commit message is why we have code reviews.",
    "git blame is going to have a field day with this one.",
    "You typed this with your eyes closed, didn't you?",
    "This is the commit message equivalent of a shrug emoji.",
    "Future you is going to hunt present you down for this.",
  ],
}

const savageRoasts: Record<string, string[]> = {
  default: [
    "This commit message is a war crime against version control.",
    "I've seen better documentation on a napkin. A used napkin.",
    "If commits could file restraining orders, this repo would be empty.",
    "This is what happens when you let the intern push to main.",
    "This commit message makes 'asdf' look like a Pulitzer winner.",
  ],
}

const existentialRoasts: Record<string, string[]> = {
  default: [
    "In the grand tapestry of commits, this one is... a loose thread that unravels everything.",
    "Does this commit message truly reflect the essence of change, or is it merely a cry into the void?",
    "Every commit is a contract with the future. You just wrote yours in disappearing ink.",
    "What is a commit if not a promise? And what is this, if not a broken one?",
    "In 100 years, no one will read this commit. But somehow, that still doesn't make it okay.",
  ],
}

const pmTranslations = [
  "We're behind schedule and nothing was tested.",
  "The sprint is on fire. Everything is on fire.",
  "This feature will ship eventually. Maybe. Probably not.",
  "Something changed and nobody knows what.",
  "The developer has gone rogue.",
  "I need to update the Jira board immediately.",
  "We need an emergency standup.",
]

const futureYouTranslations = [
  "What was I thinking? What was ANYONE thinking?",
  "I have no idea what this changed or why.",
  "Past me is officially my least favorite coworker.",
  "Time to git blame... myself.",
  "I'm going to rewrite this entire file from scratch.",
  "This is why I have trust issues with my own code.",
  "I regret everything about this Tuesday.",
]

const productionTranslations = [
  "Oh no. Oh no no no.",
  "*sweats in 99.9% uptime SLA*",
  "Deploying this felt like Russian roulette.",
  "The load balancer just flinched.",
  "ERROR 500: Commit message unclear, deploying anyway.",
  "The servers are questioning their purpose.",
  "Monitoring dashboards just turned red preemptively.",
]

const unclearOptions = [
  "What exactly was 'fixed'? A bug? A feature? A typo?",
  "What does 'stuff' refer to? The code? The tests? Your soul?",
  "Which component was affected? Where should reviewers look?",
  "No scope or context. This could literally be anything.",
  "'Update' - but update WHAT? The code? The readme? Your LinkedIn?",
  "This message tells me something changed. But that's literally what all commits do.",
]

const missingOptions = [
  "Ticket number, affected files, reason for change.",
  "Context about why this change was necessary.",
  "Impact description and testing notes.",
  "The 'why' - we can see the 'what' in the diff.",
  "Which feature or bug this relates to.",
  "Any indication of whether this was tested.",
]

const conventionalPrefixes = ["fix", "feat", "refactor", "docs", "style", "test", "chore"]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRoastForIntensity(intensity: RoastIntensity): string {
  switch (intensity) {
    case "friendly":
      return pick(friendlyRoasts.default)
    case "classic":
      return pick(classicRoasts.default)
    case "savage":
      return pick(savageRoasts.default)
    case "existential":
      return pick(existentialRoasts.default)
  }
}

export function generateAnalysis(
  commits: string[],
  intensity: RoastIntensity,
): AnalysisResult {
  const chaosScore = Math.floor(Math.random() * 40) + 60
  const archetype = pick(archetypes)
  const debugPainRating = pick(debugPainRatings)

  const roasts: CommitRoast[] = commits.map((commit) => ({
    original: commit,
    roast: getRoastForIntensity(intensity),
  }))

  const translations: TranslatorOutput[] = commits.map((commit) => ({
    whatYouWrote: commit,
    whatPMHears: pick(pmTranslations),
    whatFutureYouHears: pick(futureYouTranslations),
    whatProductionFeels: pick(productionTranslations),
  }))

  const realityChecks: RealityCheck[] = commits.map((commit) => {
    const prefix = pick(conventionalPrefixes)
    const scope = pick(["auth", "ui", "api", "db", "core", "nav", "config"])
    return {
      original: commit,
      unclear: pick(unclearOptions),
      missing: pick(missingOptions),
      suggestedRewrite: `${prefix}(${scope}): ${commit.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim() || "update module"} - add description here`,
    }
  })

  return { chaosScore, archetype, debugPainRating, roasts, translations, realityChecks }
}

export function generateRewrites(commits: string[], mode: string): string[] {
  return commits.map((commit) => {
    const prefix = pick(conventionalPrefixes)
    const scope = pick(["auth", "ui", "api", "db", "core", "nav", "config"])
    const cleaned = commit.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim() || "update module"
    switch (mode) {
      case "conventional":
        return `${prefix}(${scope}): ${cleaned}`
      case "clearer":
        return `${prefix}: ${cleaned} with improved clarity and context`
      case "shorter":
        return `${prefix}: ${cleaned.split(" ").slice(0, 4).join(" ")}`
      default:
        return `${prefix}(${scope}): ${cleaned} [rewritten for clarity]`
    }
  })
}

export const placeholderCommits = [
  "fix stuff",
  "final_final_really_final",
  "oops",
  "update",
  "why isn't this working",
  "misc changes",
  "wip",
  "asdf",
  "it works now",
  "please work",
]
