# Daily sync: how knowledge moves in a normal day

One engineer, one repo. Nothing here needs remembering except two habits: run
the sync once a day, and review the teammate's PR the same day when a contract
or a process changes.

```mermaid
sequenceDiagram
  autonumber
  participant E as Engineer (Claude session)
  participant R as Knowledge repo (main)
  participant T as Teammate (reviews the PR)
  participant X as Meetings, chat, tickets

  Note over E: Session start, automatic
  E->>R: session-pull hook does git pull, clone on main
  Note over E: the session now reads the approved knowledge

  Note over E: Once a day (5 to 15 min)
  X-->>E: read the day's meetings, chat and tickets
  E->>E: draft candidates in<br/>decisions/inbox/YYYY-MM-DD-candidates.md
  E->>E: approve each candidate in the session: approve, revise or drop
  E->>R: land the approved ones on main: decisions, notes, followups, open items, the draft. The commit names the approver
  T-->>E: sees it at the next session pull, objects by asking for an edit, if anything

  Note over E: Working on tickets, all day
  E->>R: something decided or learned during work: approved in session, on main
  E->>R: story drafts in backlog/batches on main. Once Status is approved, stories are created in the tracker
  E->>T: contract, process or hook change: pull request, T reviews and merges

  Note over E: Next session start
  E->>R: pull, yesterday's decisions, follow-ups and stories are in the clone
```

What each person does by hand in a day: open Claude (the pull is automatic), run
the sync once if it is their turn, review and merge the other person's PR, and
save a decision or a fact in the repo when something is decided or learned
outside a meeting.
