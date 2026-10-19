# Process & standards

Working agreements the team has adopted. Company-wide standards, such as
branching, the delivery lifecycle and tooling, are referenced and never
duplicated here. Links to them go in
[decisions/DECISIONS.md](../decisions/DECISIONS.md). This folder holds only
process that is specific to this project.

## Writing to this repo: two tiers

| Tier | Files | How it is approved |
|---|---|---|
| Pull request, another person reviews and merges | `skills/`, `process/`, `architecture/`, `contracts/`, `install.ps1`, `hooks/`, `CLAUDE.md`, `README.md` | Branch, PR, a person merges. Changes rarely, breaks a lot when wrong. |
| Approved in the session, committed to `main` | `decisions/DECISIONS.md`, `decisions/inbox/`, `decisions/open/`, `notes/`, `backlog/` (backlog, batches, followups) | The person shows the exact text and answers approve, revise or drop per item. Only approved items are written. The commit message names who approved. Teammates see it at their next pull, and an objection is an edit, never a silent revert. |

Kept in both tiers: nothing an agent produced enters this repo without a person
reading it and saying yes. What differs is only whether that yes happens before
merge (PR) or in the session (daily content), because a daily PR review of a
decision log does not get done and the log goes stale.

## Backlog batches and their approval

Stories are drafted from `backlog/backlog.md` in batches, into
`backlog/batches/YYYY-MM-DD-<name>.md`, committed on `main`. Every story in the
document starts with `Status: pending`. Approval is a human edit of that line to
`approved`, `revise: <note>` or `hold`, committed on `main` with the approver
named. A `revise` story is redrafted in the same document and re-enters
approval. Only then are the approved stories created in the ticket tracker,
after one confirmation for the whole approved list. Each key is written back
(`Status: created <TICKET-KEY>-###`) right after that story is created.

## Adding knowledge without a PR

Decisions land in `decisions/DECISIONS.md`, notes in `notes/`, follow-ups in
`backlog/followups.md`, and open items in `decisions/open/`. The person approves
each item, and it is committed to `main` with the approver named. A team can add
its own skills under `skills/live` to make this faster. See
[skills/README.md](../skills/README.md).

The editing policy is written up in [CONTRIBUTING.md](../CONTRIBUTING.md).
