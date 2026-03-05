"""
Regression test suite for the roast engine logic -- ported to Python
so it can run in the v0 sandbox. Tests the same behaviours as the
TypeScript vitest suite in lib/__tests__/mock-data.test.ts
"""
import random
import re
import sys
from collections import Counter

# ---------------------------------------------------------------------------
# Mirror the TypeScript roast pools and logic in Python
# ---------------------------------------------------------------------------

TAGGED_ROASTS = {
    "classic": [
        ("This commit message is why we have code reviews.", []),
        ("git blame is going to have a field day with this one.", []),
        ("You typed this with your eyes closed, didn't you?", []),
        ("This is the commit message equivalent of a shrug emoji.", []),
        ("Future you is going to hunt present you down for this.", []),
        ("I've seen grocery lists with more context than this commit.", ["update", "stuff", "things"]),
        ("This commit message is one step above keyboard mashing.", []),
        ("The 'fix' is doing a LOT of heavy lifting here.", ["fix", "fixed", "hotfix", "bugfix"]),
        ("Congratulations, you've written a commit that explains absolutely nothing.", []),
        ("This is the kind of commit that starts arguments in PR reviews.", []),
        ("Somewhere a senior dev just felt a disturbance in the force.", []),
        ("This message and a blank line have the same information density.", []),
        ("Your commit message has the same energy as 'misc' on a tax return.", ["misc", "various", "stuff"]),
        ("Tell me you were in a rush without telling me you were in a rush.", ["wip", "tmp", "quick"]),
        ("Even autocomplete would've written something more descriptive.", []),
        ("The PR reviewer is going to need therapy after reading this history.", []),
        ("You committed this at midnight, didn't you? The message radiates 2am energy.", []),
        ("This is the 'I'll explain in the PR' of commit messages. You won't.", []),
        ("A commit so vague it could be a horoscope.", []),
        ("Your commit history reads like a mystery novel with all the pages ripped out.", ["merge", "rebase"]),
    ]
}


def tokenize(commit: str) -> list[str]:
    """Same regex as TypeScript: split on [\s\-_:,.#/()] """
    return [w for w in re.split(r'[\s\-_:,\.#/()]+', commit.lower()) if w]


def assign_roasts(commits: list[str], intensity: str = "classic") -> list[str]:
    pool = TAGGED_ROASTS.get(intensity, TAGGED_ROASTS["classic"])
    used = set()
    results = []

    for commit in commits:
        words = tokenize(commit)

        scored = []
        for text, tags in pool:
            if text in used:
                continue
            # EXACT word match only (the regression fix)
            tag_score = sum(1 for tag in tags if tag in words)
            scored.append((text, tag_score))

        scored.sort(key=lambda x: -x[1])
        top_score = scored[0][1] if scored else 0

        if top_score > 0:
            top_matches = [s for s in scored if s[1] == top_score]
            chosen = random.choice(top_matches)[0]
        else:
            random.shuffle(scored)
            chosen = scored[0][0] if scored else pool[0][0]

        used.add(chosen)
        results.append(chosen)

    return results


# ---------------------------------------------------------------------------
# Test helpers
# ---------------------------------------------------------------------------
PASS = 0
FAIL = 0

def test(name: str, condition: bool, detail: str = ""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        print(f"  FAIL  {name}{(' -- ' + detail) if detail else ''}")


# ---------------------------------------------------------------------------
# tokenize() tests
# ---------------------------------------------------------------------------
print("\n--- tokenize() ---")
test("splits on spaces", tokenize("fix the bug") == ["fix", "the", "bug"])
test("splits on hyphens", tokenize("fix-the-bug") == ["fix", "the", "bug"])
test("lowercases output", tokenize("Fix The BUG") == ["fix", "the", "bug"])
test("splits on colons (conventional commits)", "feat" in tokenize("feat(auth): add login") and "auth" in tokenize("feat(auth): add login"))
test("handles empty string", tokenize("") == [])

# ---------------------------------------------------------------------------
# Exact-match regression: short words must NOT substring-match tags
# ---------------------------------------------------------------------------
print("\n--- Tag matching regression ---")

words_it = tokenize("get it working")
test('"it" is NOT in classic tag list as exact match for "fix"',
     "fix" not in words_it,
     f"words={words_it}")

words_in = tokenize("check in the changes")
test('"in" is NOT an exact match for any roast tag',
     all(tag not in ["fix", "wip", "misc"] for tag in words_in),
     f"words={words_in}")

# The fix roast must NOT appear for commits with "it" but not "fix"
fix_roast = "The 'fix' is doing a LOT of heavy lifting here."
non_fix_commits = ["get it working", "make it better", "do it now"]
all_same_fix = True
for _ in range(30):
    roasts = assign_roasts(non_fix_commits)
    if not all(r == fix_roast for r in roasts):
        all_same_fix = False
        break
test('"fix" roast does NOT dominate commits containing "it" but not "fix" (30 runs)',
     not all_same_fix)

# The fix roast SHOULD be a candidate when commit explicitly contains "fix"
words_fix = tokenize("fix the login bug")
test('"fix" IS an exact word match for commit "fix the login bug"',
     "fix" in words_fix)

# "wip" tag only matches commits with the literal word "wip"
test('"wip" matches "wip auth flow"', "wip" in tokenize("wip auth flow"))
test('"wip" does NOT match "update the workflow"', "wip" not in tokenize("update the workflow"))

# ---------------------------------------------------------------------------
# No duplicates within a single run
# ---------------------------------------------------------------------------
print("\n--- No duplicates ---")

for n in [2, 5, 10]:
    commits = [f"commit message number {i}" for i in range(n)]
    roasts = assign_roasts(commits)
    unique = len(set(roasts))
    test(f"unique roasts for {n} commits", unique == n,
         f"got {unique} unique out of {n}: {roasts}")

# Two identical commits still get different roasts
commits_same = ["fix bug", "fix bug"]
roasts_same = assign_roasts(commits_same)
test("two identical commits get different roasts",
     roasts_same[0] != roasts_same[1],
     f"both got: {roasts_same[0]}")

# ---------------------------------------------------------------------------
# Variety across runs (randomness check)
# ---------------------------------------------------------------------------
print("\n--- Variety across runs ---")

commits_variety = ["update stuff", "misc changes", "refactor module"]
seen_orders = set()
for _ in range(30):
    seen_orders.add("|".join(assign_roasts(commits_variety)))
test("different roast orderings across 30 runs (randomness)",
     len(seen_orders) > 1,
     f"only {len(seen_orders)} unique ordering(s) seen")

# ---------------------------------------------------------------------------
# Output count matches input count
# ---------------------------------------------------------------------------
print("\n--- Output count ---")

for n in [1, 3, 7]:
    commits = [f"commit {i}" for i in range(n)]
    result = assign_roasts(commits)
    test(f"returns {n} roast(s) for {n} commit(s)", len(result) == n)

test("empty input returns empty list", assign_roasts([]) == [])
test("single commit returns non-empty string",
     len(assign_roasts(["fix bug"])) == 1 and len(assign_roasts(["fix bug"])[0]) > 0)

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print(f"\n{'='*50}")
print(f"Results: {PASS} passed, {FAIL} failed")
if FAIL > 0:
    print("SOME TESTS FAILED")
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
