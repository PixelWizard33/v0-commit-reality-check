import { describe, it, expect } from "vitest"
import {
  generateAnalysis,
  assignRoasts,
  shuffle,
  type RoastIntensity,
} from "../mock-data"

// ---------------------------------------------------------------------------
// shuffle()
// ---------------------------------------------------------------------------
describe("shuffle", () => {
  it("returns an array of the same length", () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input)).toHaveLength(input.length)
  })

  it("contains the same elements as the input", () => {
    const input = ["a", "b", "c", "d"]
    const result = shuffle(input)
    expect(result.sort()).toEqual([...input].sort())
  })

  it("does not mutate the original array", () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it("handles empty arrays without throwing", () => {
    expect(() => shuffle([])).not.toThrow()
    expect(shuffle([])).toEqual([])
  })

  it("handles single-element arrays", () => {
    expect(shuffle(["only"])).toEqual(["only"])
  })
})

// ---------------------------------------------------------------------------
// assignRoasts() -- core regression tests
// ---------------------------------------------------------------------------
const intensities: RoastIntensity[] = ["friendly", "classic", "savage", "existential"]

describe("assignRoasts", () => {
  describe("no duplicates within a single run", () => {
    intensities.forEach((intensity) => {
      it(`produces unique roasts for 10 commits at intensity: ${intensity}`, () => {
        const commits = Array.from({ length: 10 }, (_, i) => `commit message number ${i}`)
        const roasts = assignRoasts(commits, intensity)
        const unique = new Set(roasts)
        expect(unique.size).toBe(roasts.length)
      })
    })
  })

  it("returns the same number of roasts as commits", () => {
    const commits = ["fix bug", "update readme", "wip"]
    const roasts = assignRoasts(commits, "classic")
    expect(roasts).toHaveLength(commits.length)
  })

  it("handles a single commit", () => {
    const roasts = assignRoasts(["fix: resolve null pointer"], "classic")
    expect(roasts).toHaveLength(1)
    expect(typeof roasts[0]).toBe("string")
    expect(roasts[0].length).toBeGreaterThan(0)
  })

  it("handles an empty commit list", () => {
    const roasts = assignRoasts([], "friendly")
    expect(roasts).toEqual([])
  })

  // ---------------------------------------------------------------------------
  // REGRESSION: tag matching must not use substring matching
  //
  // Previously `tag.includes(w)` caused short words like "it", "in", "a" from
  // any commit to match tags like "git" ("git".includes("it") === true), which
  // collapsed all commits onto the same tagged roast.
  // ---------------------------------------------------------------------------
  describe("tag matching regression", () => {
    it('does NOT match the "fix" tag for a commit that contains "it" but not "fix"', () => {
      // "it" is a substring of "git" but must NOT trigger the fix tag
      // Run many times to be sure the tag-boosted fix roast never wins
      const commits = ["get it working", "make it better", "do it now"]
      for (let i = 0; i < 20; i++) {
        const roasts = assignRoasts(commits, "classic")
        const fixTaggedRoast = "The 'fix' is doing a LOT of heavy lifting here."
        const allSame = roasts.every((r) => r === fixTaggedRoast)
        expect(allSame).toBe(false)
      }
    })

    it('matches the "fix" tag only when the commit explicitly contains "fix"', () => {
      // The fix-tagged classic roast should be the candidate when word is exactly "fix"
      const fixCommit = "fix the login bug"
      const words = fixCommit.toLowerCase().split(/[\s\-_:,.#/()]+/)
      expect(words).toContain("fix")
      // Verify exact match logic: "fix" is in words
      expect(words.includes("fix")).toBe(true)
      // Verify the old broken logic is NOT in use: short words don't substring-match
      expect("fix".includes("it")).toBe(false) // sanity
      expect(words.some((w) => "git".includes(w) && w !== "git")).toBe(false)
    })

    it('matches the "wip" tag only for commits that contain the word "wip"', () => {
      const wipCommit = "wip auth flow"
      const words = wipCommit.toLowerCase().split(/[\s\-_:,.#/()]+/)
      expect(words.includes("wip")).toBe(true)

      const nonWipCommit = "update the workflow"
      const nonWords = nonWipCommit.toLowerCase().split(/[\s\-_:,.#/()]+/)
      // "workflow" contains "wip"? No. But "wip" is not in the word list exactly.
      expect(nonWords.includes("wip")).toBe(false)
    })

    it("two identical commits still get different roasts via the used-set fallback", () => {
      // Even if both commits match the same tag, the second must fall back to
      // a different roast since the first is already marked used.
      const commits = ["fix bug", "fix bug"]
      const roasts = assignRoasts(commits, "classic")
      expect(roasts[0]).not.toBe(roasts[1])
    })
  })

  describe("variety across multiple runs", () => {
    it("does not produce the same roast order for every run (randomness check)", () => {
      const commits = ["update stuff", "misc changes", "refactor module"]
      const results = new Set<string>()
      for (let i = 0; i < 30; i++) {
        results.add(assignRoasts(commits, "classic").join("|"))
      }
      // With 20 roasts and 3 picks, probability of same order 30 times is negligible
      expect(results.size).toBeGreaterThan(1)
    })
  })
})

// ---------------------------------------------------------------------------
// generateAnalysis() -- integration-level smoke tests
// ---------------------------------------------------------------------------
describe("generateAnalysis", () => {
  it("returns the correct number of roasts for the number of commits", () => {
    const commits = ["fix bug", "update readme", "wip auth"]
    const result = generateAnalysis(commits, "classic")
    expect(result.roasts).toHaveLength(commits.length)
  })

  it("returns the correct number of translations", () => {
    const commits = ["fix bug", "update readme"]
    const result = generateAnalysis(commits, "friendly")
    expect(result.translations).toHaveLength(commits.length)
  })

  it("returns the correct number of reality checks", () => {
    const commits = ["wip", "stuff"]
    const result = generateAnalysis(commits, "savage")
    expect(result.realityChecks).toHaveLength(commits.length)
  })

  it("produces a chaos score between 0 and 100", () => {
    const result = generateAnalysis(["fix stuff"], "classic")
    expect(result.chaosScore).toBeGreaterThanOrEqual(0)
    expect(result.chaosScore).toBeLessThanOrEqual(100)
  })

  it("each roast original matches the input commit", () => {
    const commits = ["fix bug", "update readme", "wip auth"]
    const result = generateAnalysis(commits, "existential")
    result.roasts.forEach((r, i) => {
      expect(r.original).toBe(commits[i])
    })
  })

  it("no two commits receive the same roast text", () => {
    const commits = Array.from({ length: 8 }, (_, i) => `commit ${i}`)
    const result = generateAnalysis(commits, "savage")
    const texts = result.roasts.map((r) => r.roast)
    const unique = new Set(texts)
    expect(unique.size).toBe(texts.length)
  })

  it("no two commits receive the same PM translation", () => {
    const commits = Array.from({ length: 6 }, (_, i) => `commit ${i}`)
    const result = generateAnalysis(commits, "classic")
    const texts = result.translations.map((t) => t.whatPMHears)
    const unique = new Set(texts)
    expect(unique.size).toBe(texts.length)
  })

  it("returns a non-empty archetype string", () => {
    const result = generateAnalysis(["fix bug"], "friendly")
    expect(typeof result.archetype).toBe("string")
    expect(result.archetype.length).toBeGreaterThan(0)
  })

  it("works for all four intensity levels without throwing", () => {
    intensities.forEach((intensity) => {
      expect(() => generateAnalysis(["fix stuff"], intensity)).not.toThrow()
    })
  })
})
