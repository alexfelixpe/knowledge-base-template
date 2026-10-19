# Knowledge-sync drafts

One file per day, `YYYY-MM-DD-candidates.md`. Each file lists the decisions,
notes, follow-ups and open items found in that day's sources, as candidates for
a person to review.

Each candidate carries a `Status:` line the person answers in the session
(`approved`, `revise: <note>`, `dropped (reason)`). Approved items land in
`decisions/DECISIONS.md`, `notes/`, `backlog/followups.md` or `decisions/open/`
and are marked `landed`. A dropped candidate keeps its id and status, and its
body is removed. Every candidate of every kind has its own `Status:` line. The
file is committed only when none is `pending`. The drafts stay as the audit
trail of each day. A day with nothing still gets a file saying "no candidates".

## Format

```
# Knowledge sync YYYY-MM-DD

Window: <from> to <to>. Sources read: <list>. Not read: <anything skipped>.

## Candidate decisions

### C1. <one line, past tense>
Status: pending
Kind: decision
Section: <DECISIONS.md section>
Who: <names>  When: <date, meeting or thread>
Source: [<name>](<link>), <timestamp>
Reasoning: <two to four lines>
Conflicts with: <existing entry, or none>

## Candidate notes

### N1. <topic slug>: <one line>
Status: pending
Kind: note
Source: ...
Body: <two to four lines>

## Candidate follow-ups

| id | date | source | finding | severity | epic guess | status |
|---|---|---|---|---|---|---|
| (assigned at landing) | ... | ... | ... | ... | ... | pending |

## Open items (discussed, not aligned)

### O1. <one line>
Status: pending
Kind: open
Who: <names>
Source: ...

## Contract or spec notes for the owner (file changes that need a PR)

### P1. <one line>
Status: pending
Kind: contract-change
Source: ...

## Already recorded (skipped)
- <subject> is the YYYY-MM-DD entry
```
