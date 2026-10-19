# <PRODUCT> follow-up queue

> Findings from reviews and working sessions that should be handled in another
> ticket, held here so they can be bundled into backlog items instead of
> becoming a pile of tiny tickets.
>
> **How items get here.** A reviewer may first keep a finding in any personal
> file outside this repo. That step is optional. A finding that meets the entry
> bar below is added here on the daily tier: a person reads it, approves it in
> the session, and commits it to `main`. Nothing an agent produced lands here
> without a human reading it first.
>
> **How items leave.** Through deliberate triage, normally when a backlog item
> is converted into stories. Sweep this queue for related open items and fold
> them into the story before it is created. Related items are grouped into
> single tickets, never one ticket per row.
>
> **The escape hatch.** Anything that needs action before the next triage (a
> live security hole, a leaked credential) goes straight to a ticket or a
> blocking review comment. If it can wait for triage, it is a row here. If it
> cannot, it is a ticket.
>
> Statuses: `open`, then `bundled <TICKET-KEY>-###` (folded into a story at
> conversion), `ticketed <TICKET-KEY>-###` (cut directly), `question (<owner>)`
> (waiting for an answer before any work can start), or `dropped (reason)`.
>
> **The entry bar.** A finding becomes a row here only if all four hold:
> someone would open a ticket just for it; its severity is not `nice`; its pull
> request adds at most 2 rows; the finding fits in one line. A finding that
> fails the bar is simply not added here.
>
> **Ids.** Each row id is unique. The next id is the highest existing id plus
> one. Rows are not kept in id order, so read the whole file to find the highest.
>
> **Source grammar.** Every row's source names the system it belongs to before
> its coordinate, because findings about different systems go to different
> places and cannot be told apart later from the channel the conversation
> happened in. Define your systems here, for example:
>
> - `<system-a>`: the system the team ships.
> - `kb`: this repo and its tooling.
>
> Coordinate: `pr <repo> #<n> @<sha7>` whenever a PR exists, since it ties the
> finding to the change without later reconciliation. Otherwise
> `review <repo> <branch> @<sha7>`, `ticket <TICKET-KEY>-###`,
> `meeting <name> <date>` or `run observed <date> via <where>`.

| id | date | source | finding | severity | epic guess | status |
|----|------|--------|---------|----------|------------|--------|
