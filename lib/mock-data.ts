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

// --- Keyword-tagged roast system ---
// Each roast has optional keyword tags. If a commit matches tags, it gets priority.
// "default" roasts are fallbacks when nothing matches.

interface TaggedRoast {
  text: string
  tags?: string[]
}

const friendlyRoasts: TaggedRoast[] = [
  { text: "Ah, a commit message only its creator could love." },
  { text: "This is... creative! In a modern art kind of way." },
  { text: "Your commit messages have a certain enigmatic charm." },
  { text: "I'm sure this made perfect sense at the time!" },
  { text: "This commit has big 'trust me bro' energy." },
  { text: "Somewhere, a tech writer just shed a single tear.", tags: ["docs", "readme", "documentation"] },
  { text: "A commit message as mysterious as the code it describes." },
  { text: "At least you committed. Baby steps." },
  { text: "Your future self is going to need a decoder ring for this one." },
  { text: "This is giving 'I'll add details later' energy. You won't." },
  { text: "Bold strategy: letting the diff speak for itself.", tags: ["update", "change", "modify"] },
  { text: "Your commit message is short. Your debugging session won't be." },
  { text: "The optimism in this commit is almost inspiring.", tags: ["fix", "fixed", "works", "working"] },
  { text: "This reads like you were already halfway out the door.", tags: ["wip", "todo", "tmp"] },
  { text: "A message so vague it could apply to literally any commit in history." },
  { text: "You wrote this during a meeting, didn't you?" },
  { text: "Brief, mysterious, and slightly concerning. Like a text from your ex." },
  { text: "I admire the confidence it took to push this without elaboration." },
  { text: "This commit message sparks joy. And also confusion.", tags: ["refactor", "cleanup", "clean"] },
  { text: "Technically a commit message. Technically." },
]

const classicRoasts: TaggedRoast[] = [
  { text: "This commit message is why we have code reviews." },
  { text: "git blame is going to have a field day with this one." },
  { text: "You typed this with your eyes closed, didn't you?" },
  { text: "This is the commit message equivalent of a shrug emoji." },
  { text: "Future you is going to hunt present you down for this." },
  { text: "I've seen grocery lists with more context than this commit.", tags: ["update", "stuff", "things"] },
  { text: "This commit message is one step above keyboard mashing." },
  { text: "The 'fix' is doing a LOT of heavy lifting here.", tags: ["fix", "fixed", "hotfix", "bugfix"] },
  { text: "Congratulations, you've written a commit that explains absolutely nothing." },
  { text: "This is the kind of commit that starts arguments in PR reviews." },
  { text: "Somewhere a senior dev just felt a disturbance in the force." },
  { text: "This message and a blank line have the same information density." },
  { text: "Your commit message has the same energy as 'misc' on a tax return.", tags: ["misc", "various", "stuff"] },
  { text: "Tell me you were in a rush without telling me you were in a rush.", tags: ["wip", "tmp", "quick"] },
  { text: "Even autocomplete would've written something more descriptive." },
  { text: "The PR reviewer is going to need therapy after reading this history." },
  { text: "You committed this at midnight, didn't you? The message radiates 2am energy." },
  { text: "This is the 'I'll explain in the PR' of commit messages. You won't." },
  { text: "A commit so vague it could be a horoscope." },
  { text: "Your commit history reads like a mystery novel with all the pages ripped out.", tags: ["merge", "rebase"] },
]

const savageRoasts: TaggedRoast[] = [
  { text: "This commit message is a war crime against version control." },
  { text: "I've seen better documentation on a napkin. A used napkin." },
  { text: "If commits could file restraining orders, this repo would be empty." },
  { text: "This is what happens when you let the intern push to main.", tags: ["main", "master", "prod"] },
  { text: "This commit message makes 'asdf' look like a Pulitzer winner." },
  { text: "This commit is proof that we peaked as a species and are now in decline." },
  { text: "Your git log looks like someone threw a dictionary into a blender." },
  { text: "This message has the descriptive power of a blank sticky note.", tags: ["update", "change"] },
  { text: "I'd ask what you were thinking, but clearly nobody was." },
  { text: "The entire git history just depreciated in value because of this." },
  { text: "This commit should require a written apology to every future maintainer." },
  { text: "Not even GitHub Copilot could make sense of what happened here.", tags: ["ai", "copilot", "generate"] },
  { text: "You didn't just cut corners. You removed the entire shape.", tags: ["refactor", "rewrite"] },
  { text: "This is the version control equivalent of leaving a post-it that says 'good luck'.", tags: ["fix", "fixed"] },
  { text: "Reading this commit message lowered my will to code by 15%." },
  { text: "Whoever reviews this PR deserves hazard pay." },
  { text: "This message contributes nothing. Much like the commit itself, probably." },
  { text: "Your future self isn't going to debug this. They're going to rewrite it from scratch." },
  { text: "Bold of you to assume anyone can reverse-engineer intent from this.", tags: ["wip", "tmp", "todo"] },
  { text: "This commit is why developers have trust issues." },
]

const existentialRoasts: TaggedRoast[] = [
  { text: "In the grand tapestry of commits, this one is... a loose thread that unravels everything." },
  { text: "Does this commit message truly reflect the essence of change, or is it merely a cry into the void?" },
  { text: "Every commit is a contract with the future. You just wrote yours in disappearing ink." },
  { text: "What is a commit if not a promise? And what is this, if not a broken one?" },
  { text: "In 100 years, no one will read this commit. But somehow, that still doesn't make it okay." },
  { text: "This commit exists in the space between meaning and entropy. Mostly entropy." },
  { text: "You wrote this commit, but did this commit write you? Think about it." },
  { text: "The diff knows what changed. The message knows nothing. Are we the message?", tags: ["update", "change"] },
  { text: "If a commit is pushed and no one understands the message, was there ever really a message?" },
  { text: "This commit is a monument to the impermanence of intention." },
  { text: "Every keystroke was a choice. These choices haunt me.", tags: ["fix", "fixed", "stuff"] },
  { text: "We commit code into the void and call it progress. This is not progress." },
  { text: "Sisyphus had his boulder. You have this git history.", tags: ["revert", "undo", "rebase"] },
  { text: "The universe tends toward disorder. So does your commit history." },
  { text: "Is this a commit message or a confession? Either way, it explains nothing." },
  { text: "You've captured the futility of documentation in a single line." },
  { text: "Some commits tell a story. This one tells you that stories are meaningless.", tags: ["wip", "tmp"] },
  { text: "This message is a philosophical paradox: it exists, yet says nothing." },
  { text: "In the infinite branches of the multiverse, not one has a good version of this commit." },
  { text: "The commit was pushed. The meaning was not.", tags: ["merge", "squash"] },
]

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

/** Fisher-Yates shuffle (returns new array) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getRoastPool(intensity: RoastIntensity): TaggedRoast[] {
  switch (intensity) {
    case "friendly":
      return friendlyRoasts
    case "classic":
      return classicRoasts
    case "savage":
      return savageRoasts
    case "existential":
      return existentialRoasts
  }
}

/**
 * For each commit, find roasts whose tags match words in the commit.
 * Then fill remaining slots from unmatched roasts.
 * Guarantees no two commits get the same roast in a single run.
 */
function assignRoasts(commits: string[], intensity: RoastIntensity): string[] {
  const pool = getRoastPool(intensity)
  const usedTexts = new Set<string>()
  const results: string[] = []

  for (const commit of commits) {
    const words = commit.toLowerCase().split(/[\s\-_:,.#/()]+/)

    // Score each roast by how many tags exactly match words in the commit
    const scored = pool
      .filter((r) => !usedTexts.has(r.text))
      .map((r) => {
        const tagScore = r.tags
          ? r.tags.reduce((s, tag) => s + (words.includes(tag) ? 1 : 0), 0)
          : 0
        return { text: r.text, score: tagScore }
      })

    // Sort by score descending, then shuffle within same-score groups for variety
    scored.sort((a, b) => b.score - a.score)

    // Grab top-scored matches, or fall back to random unmatched
    const topScore = scored[0]?.score ?? 0
    let chosen: string

    if (topScore > 0) {
      // Pick randomly among the best tag matches
      const topMatches = scored.filter((s) => s.score === topScore)
      chosen = topMatches[Math.floor(Math.random() * topMatches.length)].text
    } else {
      // No tag matches -- pick random from unused pool
      const available = shuffle(scored)
      chosen = available[0]?.text ?? pool[Math.floor(Math.random() * pool.length)].text
    }

    usedTexts.add(chosen)
    results.push(chosen)
  }

  return results
}

export function generateAnalysis(
  commits: string[],
  intensity: RoastIntensity,
): AnalysisResult {
  const chaosScore = Math.floor(Math.random() * 40) + 60
  const archetype = pick(archetypes)
  const debugPainRating = pick(debugPainRatings)

  // Roasts: context-aware, guaranteed unique per run
  const roastTexts = assignRoasts(commits, intensity)
  const roasts: CommitRoast[] = commits.map((commit, i) => ({
    original: commit,
    roast: roastTexts[i],
  }))

  // Translations: shuffle pools so no two commits get the same line
  const shuffledPM = shuffle(pmTranslations)
  const shuffledFuture = shuffle(futureYouTranslations)
  const shuffledProd = shuffle(productionTranslations)

  const translations: TranslatorOutput[] = commits.map((commit, i) => ({
    whatYouWrote: commit,
    whatPMHears: shuffledPM[i % shuffledPM.length],
    whatFutureYouHears: shuffledFuture[i % shuffledFuture.length],
    whatProductionFeels: shuffledProd[i % shuffledProd.length],
  }))

  // Reality checks: shuffle unclear/missing pools too
  const shuffledUnclear = shuffle(unclearOptions)
  const shuffledMissing = shuffle(missingOptions)

  const realityChecks: RealityCheck[] = commits.map((commit, i) => {
    const prefix = pick(conventionalPrefixes)
    const scope = pick(["auth", "ui", "api", "db", "core", "nav", "config"])
    return {
      original: commit,
      unclear: shuffledUnclear[i % shuffledUnclear.length],
      missing: shuffledMissing[i % shuffledMissing.length],
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
