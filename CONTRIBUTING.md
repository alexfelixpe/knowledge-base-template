# Writing to this repo

Everyone on the <TEAM> team has write access to this repo. Write access is
trust, not a free hand.

This repo is the curated context that every person and every agent on the team
builds from. Agents read the decision log before they plan a change in the
product repos. A wrong, vague or invented entry gets executed as truth. Treat an
edit here with the care of a production change.

## Quick reference

| I want to... | It goes in | How |
|---|---|---|
| Record a fact or something I found | `notes/<topic>.md` | Daily tier |
| Raise a question that needs a ruling | `decisions/open/` | Daily tier. Name who should rule |
| Record a decision that was already made | `decisions/DECISIONS.md` | Daily tier, and it must meet the bar in section 2 |
| Capture a review finding for later | `backlog/followups.md` | Daily tier, only if it meets the entry bar in the header of `backlog/followups.md`. Follow that header for the id. A finding that fails the bar is not added. Keeping it first in a personal file outside the repo is optional |
| Change the architecture, a contract, a process, a skill, a hook, `install.ps1`, `CLAUDE.md`, `README.md` or this file | The file itself | Branch and pull request. Someone else merges |
| Draft or approve backlog stories | `backlog/batches/` | The batch process in [process/README.md](process/README.md) |

## 1. The two tiers

The full table is in [process/README.md](process/README.md). In short:

- **Daily tier.** The person making the change approves it, in the session or by
  hand when editing without Claude Code. It is committed straight to `main`. The
  commit message names the approver.
- **PR tier.** Branch, pull request. A person other than the author merges.
- A decision about a contract, the architecture or a skill is logged on the
  daily tier. The change to the file itself goes by pull request.

## 2. The decision log is different

`decisions/DECISIONS.md` is the most used file in the repo. Read this section
before you touch it.

**It records decisions that were already made.**

- Nobody makes a decision by writing it here.
- If you want something decided, open an item in `decisions/open/` and name who
  should rule.
- No source, or not sure it was actually made: it is an open item, not an entry.
- A decision is two people agreeing, or one owner ruling in their area.

**Every entry needs:**

- The date.
- What was decided, as one bold heading line.
- Who was in the decision.
- The source: a link, or the meeting and time.
- No source means it is not ready for the log. It is an open item.

**Changing an existing entry:**

- Same subject and same substance: amend the entry and say what changed, with
  the date.
- A different ruling: add a new entry. The old entry gains "superseded by the
  YYYY-MM-DD entry".
- Old text is never rewritten or deleted.

**Copy the format of the neighbouring entry.** The log is searched, not read end
to end. An entry in the wrong shape is invisible to the people and agents who
need it.

**What a bad entry costs.** Whoever plans the next change builds on it as if it
were true. A broken change is rolled back with a revert, never by rewriting
history. The revert says why, and the commit history shows whose change it was.
Repair goes forward.

## 3. What never goes in

- Customer data.
- Credentials.
- Personal absolute paths.
- Raw transcripts, chat logs, session dumps or screenshots of chat. Promote the
  decision or the fact, not the conversation.
- Anything an agent wrote that you have not read yourself.
- Live ticket status. The tracker owns it.
- Application code. That stays in the product repos.
- Exploratory work. That belongs in a spikes repo.
- Logs, scratch files and generated files.
- Text in a language other than English.

## 4. How to make a daily-tier change

**With Claude Code and your team's skills**

If your team adds skills under `skills/live`, a skill can show you the text, ask
you to approve each item, and commit with your name.

**By hand (editor or web UI)**

1. Pull `main` first.
2. Make the edit. Match the neighbouring entry. A decision goes in the right
   section, newest first. If it rules an open item, delete that open item in the
   same commit.
3. Commit straight to `main` with the message
   `knowledge: <what>, approved by <your name>`.
4. Push right away.

Do not let an edit sit uncommitted, and do not batch several days. An untracked
file left in a clone blocks every later pull in that clone.

**Never**

- Force-push.
- Rebase or rewrite `main`.
- Amend someone else's commit.
- Move or rename files on `main`. That is a pull request.

## 5. When you disagree with an entry

An objection is an edit or an open item. It is never a silent revert.

- Talk to the people named in the entry.
- If the outcome changes, add a new entry. The old one gains "superseded by the
  YYYY-MM-DD entry".
- Amend only for the same ruling (a detail, a source, a date).
- If there is no agreement yet, open an item.

## 6. When something goes wrong

- A bad commit is reverted.
- The person reverting says why in the commit message and tells the author.
- The fix goes forward. Nobody rewrites history to hide a mistake.
- Not sure whether something belongs here? Open an item, or ask the maintainers.
  Asking is cheap. A wrong entry gets built.

---

The rules for agents are in `CLAUDE.md`. They must say the same thing as this
file. If they differ, one of them is wrong, and the fix is a pull request.
