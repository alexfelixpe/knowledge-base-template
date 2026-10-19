# Skills

A skill is a folder with a `SKILL.md` file inside. It teaches Claude one
repeatable job, so the team's processes are applied the same way every time.

This repo starts with no skills. A team adds its own.

## Layout

| Folder | Meaning |
|---|---|
| `skills/live/<name>/SKILL.md` | Approved. This is what everyone runs. |
| `skills/draft/<name>/SKILL.md` | Proposed. Under review in a PR, or being tried by one person. Never linked into a working `~/.claude/skills`. |

New skills start in `draft/` and move to `live/` by a pull request that moves
the folder. Removing or renaming a live skill is also a pull request.

## Install

Clone this repo and run the script once, from the clone, in PowerShell:

```powershell
.\install.ps1
```

It links every folder under `skills/live` into `~/.claude/skills` (directory junctions, no admin rights
needed; a `git pull` of this repo updates the skills in place), and registers
the shared Claude Code hook in `~/.claude/settings.json`:
`hooks/session-pull.mjs` (SessionStart: pull this clone when it is on `main`).
The script rewrites `~/.claude/settings.json`. Every other key is kept, and a
`.bak` copy is left beside it. A preflight checks node, the settings file and
skill-folder conflicts before any write, so a failed run changes nothing.
Re-running is safe. With empty skill folders, it links nothing and still
succeeds.

Do not copy skill folders, because a copy goes stale silently. Do not link
`draft` except to try an unmerged skill (`.\install.ps1 -Tier draft`).

A `git pull` only updates a skill that is already linked. When this repo gains
a new skill folder under `skills/live`, re-run `install.ps1` to link it.

## Configuration every skill reads

Skills contain no personal absolute paths and no credential file paths. The
template needs no environment variables. If your own skills need one, add a
table here with a row per variable: its name and its meaning.

## Rules every shared skill follows

- Two tiers of writes: skills, process, architecture, contracts and hooks
  change by branch and pull request. Decisions, inbox, backlog, batches and
  follow-ups are approved by the person in the session and committed to `main`
  with the approver named. Either way, no agent text enters without a human yes.
- Nothing is created in the ticket tracker without a human approval step.
- Skills cite only rulings recorded in `decisions/DECISIONS.md`. A rule that is
  not recorded there is added by PR first, or left out of the skill.
- No person's name inside a skill. Use roles: the drafting engineer, the
  reviewer, the author, the operator.
- Skills, and everything they write to the repo, are in plain English.
- Reference company-wide standards through links in `decisions/DECISIONS.md`.
  Never restate them.
