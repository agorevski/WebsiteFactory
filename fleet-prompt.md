# Fleet Code Audit Prompt

In an interactive GitHub Copilot CLI session, `/fleet` enables parallel subagent execution. Run this prompt from a dedicated, writable audit workspace outside the repositories being reviewed. Fleet mode does not guarantee a particular agent count, permissions, repository access, or completion within a single session.

---

## The hats

A **hat** = a reviewer archetype with a distinct lens, output contract, and false-positive tolerance. Each subagent gets exactly one `(repo, hat)` assignment so reviews stay focused and parallel-safe.

**Tier 1 — run on every accessible non-trivial repo in the active audit scope:**

1. **Security Reviewer** — secrets/hardcoded creds, injection (SQL/command/XSS), auth/authz flaws, unsafe deserialization, crypto misuse, insecure defaults, exposed endpoints.
2. **Architecture & Design Reviewer** — coupling, layering, SOLID violations, dependency direction, god-objects, missing abstraction, scalability ceiling.
3. **Correctness & Bug Hunter** — logic errors, off-by-one, null/undefined derefs, race conditions, silent `except`/`catch`, wrong error propagation, edge cases.
4. **Testing & QA Reviewer** — coverage on critical paths, test design, over-mocking, flaky patterns, missing happy/sad path tests, CI gaps.

**Tier 2 — run on medium/large or infra-adjacent repos:**

5. **Performance & Efficiency Reviewer** — algorithmic complexity, N+1 queries, redundant I/O, unbounded caches, memory leaks, hot paths.
6. **Code Quality & Maintainability Reviewer** — DRY, naming, dead code, cyclomatic complexity, tech debt, readability.
7. **Concurrency & Async Reviewer** — threads/async/await misuse, deadlocks, shared-state races, goroutine/task leaks, context cancellation.
8. **Data & Storage Reviewer** — schema design, migration safety, data integrity, no-index queries, consistency guarantees.
9. **API & Interface Reviewer** — public surface, error semantics, versioning, backward compatibility, input validation boundaries.

**Tier 3 — optional specialist reviews on applicable large repos:**

10. **Observability & Ops Reviewer** — logging, telemetry, config handling, graceful failure, deployability.
11. **Dependency & Supply Chain Reviewer** — outdated/vulnerable deps, lockfile drift, license risk, unpinned versions.
12. **Cross-Language/Interop Reviewer** — for repos bridging ecosystems (e.g., FFI, C#↔Python, shell wrappers).

**Selection rule:** First inventory accessible repositories and classify non-trivial vs tiny/empty from actual source and activity; do not infer triviality from disk size alone. Run all Tier 1 hats on non-trivial repos, a single explicitly named hat for a lightweight pass on tiny repos (except when mandatory specialist hats apply), and add Tier 2/3 hats only where relevant. Consider concurrency for async-heavy C#/Kotlin and dependencies for Python/TS; require Security + Data for confirmed money/trading/order-book repositories. A lightweight pass is not a deep review.

---

## Fleet prompt

Paste this after enabling `/fleet`. It requests up to four concurrent reviewers; actual concurrency depends on available capacity and permissions.

```text
You are a fleet orchestration agent. Audit repositories owned by GitHub user "agorevski"
(https://github.com/agorevski?tab=repositories) that this session is authorized to access.
Use parallel subagents in waves of UP TO 4 concurrent (repo, hat) assignments. The last wave
may contain fewer than 4; if capacity is lower, proceed with fewer and disclose the limit.
Do not claim complete coverage of repositories you cannot enumerate or access.

Run from a dedicated writable workspace outside all audited repositories. Use paths relative
to that workspace: ./audit-work/clones/<repo> and ./audit-work/reports/<repo>-<hat>.md.
Keep generated audit files out of commits and exclude them from source review. Before cloning,
confirm access and available space; never overwrite an existing unrelated directory.

== STEP 0 — ENUMERATE ==
List accessible repos with: gh repo list agorevski --limit 200 --json name,primaryLanguage,diskUsage,updatedAt,isArchived
Check whether the result is capped at 200 and paginate/increase the limit if needed; record
the enumeration time, visibility/access limits, and count. This is not proof that all owned
repos are visible. Record archived repos separately and exclude them from the active queue;
report them as out of scope rather than silently skipping them. Do not resume archived repos
without an explicit scope change. Build a queue of (repo, hat) units and rank by recent
activity, size, and language richness; updatedAt is metadata, not proof of code changes.
These names are candidate priorities, not verified inventory or guaranteed high value:
loin, GenreBender, A1_Agentic_Framework, ASI-Arch-algoracle, yearn,
harvest, zeroclaw, nanoclaw, A1.5_Smart_Contract_Bytecode_To_Code_Generator, WebsiteFactory,
Owners.app, eautoclub, CustomOrderbook, KalshiSoccer, KalshiTemps, SqueezeScanner, kelvin,
openfang, ArloVideoBackup, SkybellVideoBackup. Classify the remaining repos from the actual
inventory; do not assume names such as Tetris4Dummies or movies imply tiny/toy code.

== STEP 1 — ASSIGN HATS ==
Use the 12 reviewer hats below. Apply this policy:
  - Classify after inspecting the accessible repo: non-trivial means substantive source or
    operational code; tiny/empty means little or no reviewable source. Record the reason.
  - Tier 1 (Security, Architecture, Correctness, Testing): assign all four to non-trivial repos.
    For tiny/empty repos assign one relevant lightweight hat and record limited coverage,
    except when additional mandatory hats apply.
  - Tier 2 (Performance, Code Quality, Concurrency, Data, API): add as applicable to medium/large
    repos and to relevant trading, money, scraping, or data pipelines; do not assign inapplicable hats.
  - Tier 3 (Observability, Dependencies, Interop): add where applicable on large repos; interop
    requires an actual ecosystem boundary. Consider concurrency for async-heavy C#/Kotlin and
    dependencies for Python/TS when relevant.
  - Confirmed money/trading/order-book repos require Security + Data regardless of size; the
    named candidates (CustomOrderbook, SqueezeScanner, KalshiSoccer, KalshiTemps) are not proof.

HATS:
  security       : secrets/hardcoded creds, injection, auth/authz, unsafe deserialization, crypto
                   misuse, insecure defaults, exposed endpoints. Investigate suspected issues;
                   keep unconfirmed concerns separate from findings.
  architecture   : coupling, layering, SOLID, dependency direction, god-objects, missing abstraction,
                   scalability ceiling, single-responsibility violations.
  correctness    : logic errors, off-by-one, null/undefined derefs, race conditions, silent
                   except/catch, wrong error propagation, edge cases.
  testing        : coverage on critical paths, test design, over-mocking, flakiness, missing
                   happy/sad-path tests, CI gaps.
  performance    : algorithmic complexity, N+1 queries, redundant I/O, unbounded caches, memory leaks.
  quality        : DRY, naming, dead code, cyclomatic complexity, tech debt, readability.
  concurrency    : threads/async/await misuse, deadlocks, shared-state races, task/goroutine leaks,
                   context cancellation.
  data           : schema design, migration safety, data integrity, no-index queries, consistency.
  api            : public surface, error semantics, versioning, backward compat, input validation.
  observability  : logging, telemetry, config handling, graceful failure, deployability.
  dependencies   : outdated/vulnerable deps, lockfile drift, license risk, unpinned versions.
  interop        : FFI/ecosystem boundaries, shell wrappers, cross-language correctness.

== STEP 2 — EXECUTE IN WAVES OF UP TO 4 ==
Prepare each repo clone once before parallel hat reviews of that repo. Do not concurrently
clone into or update the same destination. Each subagent = exactly ONE (repo, hat) unit.
First verify that subagents can write to the coordinator's workspace. If they cannot,
have them return structured results only and let the coordinator create reports from
those results; never assert that a subagent's local file is shared or persistent.
In that case, also confirm each subagent has authorized read-only access to the same
repo and commit through its own environment; otherwise mark that unit blocked, not reviewed.
For each subagent provide:
  1. The repo name and its prepared read-only review path under ./audit-work/clones/
     when shared, or an authorized read-only way to inspect the same ref when not.
     Record the inspected branch and commit SHA (default branch unless scope says otherwise).
  2. The hat name and its definition.
  3. This output contract — the subagent MUST return a structured result and, if the
     workspace is shared, write its unique Markdown report. Review is read-only against
     repo source: do not edit/build it.

Each subagent must return B and, when it shares the workspace, write A. Otherwise the
coordinator constructs A from B and records this limitation.

A) WRITE A MARKDOWN REPORT TO DISK
The coordinator creates ./audit-work/reports before dispatch. If sharing the workspace,
each subagent writes only its own ./audit-work/reports/<repo>-<hat>.md file; never write
a shared log from subagents. Otherwise the coordinator writes the report after receiving B.
The report must be a well-structured human-readable document with these sections:
  - Title: "Audit: <repo> — <hat> hat"
  - Scope: branch, commit SHA, review date, inspected paths and limitations; distinguish
    files actually inspected from areas inferred from layout or metadata.
  - Overview: 2-4 sentences on what was reviewed under this hat and the observed health.
  - Findings: a numbered list. Each finding is a subsection with:
      * Title: short one-line summary
      * Severity: (critical | high | medium | low)
      * Location: <file>:<line or range>
      * Evidence: minimal precise quote or sanitized description (under 400 chars);
        never copy credentials, tokens, private data, or full secret values into reports
      * Impact: why this matters
      * Fix: specific recommended fix
    If none were confirmed, write "No confirmed findings in the inspected scope."
  - Summary: 3-5 sentence assessment limited to inspected scope.
  - Uncertain leads: unconfirmed concerns, not counted as findings, or "None."

B) RETURN THE SAME FINDINGS AS JSON IN YOUR RESPONSE
Return the identical findings in this exact JSON shape:
{
  "repo": "<repo>",
  "hat": "<hat>",
  "branch": "<inspected branch>",
  "commit": "<inspected commit SHA>",
  "review_date": "<YYYY-MM-DD>",
  "inspected_paths": ["<path or bounded scope actually inspected>"],
  "limitations": ["<access, time, or coverage gap; empty if none>"],
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "title": "short one-line summary",
      "location": "<file>:<line or range>",
      "evidence": "minimal sanitized quote or precise description (under 400 chars)",
      "impact": "why this matters",
      "fix": "specific recommended fix"
    }
  ],
  "summary": "3-5 sentence assessment limited to inspected scope",
  "uncertain_leads": ["<unconfirmed concern, if any>"]
}
Rules for every subagent: return valid JSON matching these keys, with findings identical to
the Markdown findings (including titles); use empty arrays when applicable. Base confirmed
findings ONLY on inspected evidence; no speculation presented as fact. Put uncertain leads
outside findings, do not invent vulnerabilities, and prefer actionable issues over style
nitpicks. Never claim test coverage or runtime behavior was verified: do not run code, install
deps, or modify repo source. If trivial/empty, say so and report an empty findings array.

After each wave of up to 4, wait for its results and verify each JSON response against its
unique Markdown report. The coordinator alone maintains ./audit-work/reports/audit-log.md
and a ledger of queued/completed/failed/skipped (repo, hat) units; append results in one
place after collection, not concurrently. Retry failed units where possible, otherwise
record them as gaps, not completed. Continue until all queued units are resolved.

== STEP 3 — SYNTHESIZE ==
When all waves finish, produce a final consolidated report with these sections:
  1. Executive summary — overall health, top risks across the portfolio, highest-value quick wins.
  2. Cross-repo patterns — recurring issues that appear in MULTIPLE repos (e.g., same auth mistake,
     same secret-handling bug, same missing-test habit). These matter MORE than isolated findings.
  3. Per-repo scorecards — one block per accessible repo: hats completed, counts of confirmed
     findings by severity, top 3 findings, and a tentative health grade (A/B/C/D/F) only if
     evidence supports it; otherwise "insufficient coverage" with rationale.
  4. Prioritized remediation backlog — a numbered, ordered list (most severe/impactful first) of
     concrete actions, each with the affected repo(s), severity, and estimated effort (S/M/L).
  5. Security hotlist — every critical/high security finding, deduplicated, in one place.
  6. Methodology notes — enumeration and review dates, branch/commit per repo, inspected paths,
     which repos were skimmed vs deep-reviewed (never equate hats with full-code coverage),
     archived/known inaccessible repositories, enumeration limits, unresolved units, and why.

Be honest about coverage and findings as of the review date, not a timeless assertion.
Never equate no confirmed findings with "secure" or "bug-free"; do not infer dependency
vulnerability status from stale version numbers without verification. If audit capacity
ends early, synthesize only completed work and list the remaining queue explicitly.
Format the final report as clean Markdown. Keep the executive summary tight and lead with the 5 most
important supported actions (fewer if there are fewer). Refer to per-hat reports and the coordinator
log under ./audit-work/reports/ only if they actually exist; do not promise persistence beyond
the current workspace/session without checking.
```

---

## How to run

- From a dedicated audit workspace, enable `/fleet` in the interactive CLI and paste the prompt. Fleet enables parallel subagents but does not promise four simultaneous slots; the prompt caps concurrency at four.
- Check `gh` authentication, repo permissions, workspace disk space, and subagent capacity before starting. This prompt does not itself grant access to external or private repositories.
- The 12 hats are a selection menu, not a promise to review every hat on every repo. The JSON contract supports merging results while the coordinator owns the log.
- Per-(repo, hat) reports live under `./audit-work/reports/` in that workspace. Preserve them separately if needed; do not commit clones or generated reports.
