# <PROJECT> Knowledge Base

Single source of truth for the <PRODUCT> project's architecture and decisions.

This repo holds the durable knowledge of the <TEAM> team: architecture
documents, the decisions the team agrees on, and the process standards it works
by. Agreements made in meetings and chat threads land here, where they can be
reviewed and versioned. They do not stay in scattered docs and personal memory.

It is separate from any spikes repo: spikes are for exploratory code. This repo
is for what the team decided and how it works.

## What lives here

- **Architecture.** The target architecture document and its supporting design
  docs. Service contracts live in `architecture/contracts/`: living agreements
  between named services, versioned here so changes are coordinated and never
  silent.
- **Decisions.** The decisions the team agreed on. Each entry records what was
  decided, who decided it, and the source, so a decision outlives the meeting
  that made it.
- **Backlog.** The breakdown of work items with their dependencies, milestones
  and order. Stories in the ticket tracker are created from it. Once a story is
  cut, its day-to-day status lives in the tracker. The breakdown records why the
  work exists and what it depends on. `backlog/followups.md` is the queue of
  findings from reviews and working sessions. A person promotes them here after
  reading them, and they are bundled into backlog items when stories are cut,
  not turned into one ticket each.
- **Notes.** `notes/`: knowledge that is not a decision, such as a fact about
  the data, a useful doc, or how something works. One file per topic.
- **Process and standards.** The working agreements the team has adopted.
- **Skills.** `skills/live/` holds the shared skills the team runs.
  `skills/draft/` holds proposals. See [skills/README.md](skills/README.md).

## What does not live here

- Application or service code. That stays in the product repos.
- Exploratory or throwaway work.
- Live ticket status. The ticket tracker owns it, and it is never mirrored here.

## Conventions

- How to write here, and what never goes in: [CONTRIBUTING.md](CONTRIBUTING.md).
- Two tiers of writes (details in [process/README.md](process/README.md)).
  Skills, process, architecture, contracts, hooks, `install.ps1`, `CLAUDE.md`
  and this README change by pull request. The decision log, inbox, open items,
  notes, backlog and follow-ups are approved by the person in the session and
  committed to `main` with the approver named.
- Curated content only. Nothing an agent generated lands here until a person
  reads it. Agents keep their own local memory, and people promote what belongs
  here.
- Documents are Markdown, one topic per file.
- When a decision changes, update the record and never delete it. Say what
  changed and why, so the history stays readable.

## Setup

Clone the repo, then run `install.ps1` once from the clone in PowerShell. It
links any skills under `skills/live` into `~/.claude/skills`, and registers a session hook that pulls
the clone at the start of each Claude Code session. See
[skills/README.md](skills/README.md) for details.

## Reading this repo from a personal memory vault (optional)

If you keep a personal memory vault, you can clone this repo inside it as a
read-only mirror, so the knowledge is searchable from any project. Schedule a
`git pull --ff-only` on the mirror. Nothing in the vault ever pushes to this
repo.

## Follow-up curation

The flow for findings that come up during reviews and working sessions, the
things that "should be a separate ticket":

1. **Keep it locally, if you like.** A reviewer may note a finding in any
   personal file outside this repo. This step is optional. Agents never write
   here on their own.
2. **Add it after review.** A finding that meets the entry bar in
   `backlog/followups.md` is read by a person, approved in the session, and
   committed to `main` with the approver named. A finding that fails the bar is
   not added.
3. **Bundle at conversion.** When a backlog item becomes tickets, sweep
   `backlog/followups.md` for related open items and fold them into those
   tickets.
4. **Urgent items skip the queue.** Anything that cannot wait, such as a live
   security hole or a leaked credential, goes straight to a ticket or a
   blocking review comment.
