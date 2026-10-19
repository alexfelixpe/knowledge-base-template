# Contracts

A contract file is a living agreement between named services or teams. Each
file states three things at the top:

- **Parties.** Who produces and who consumes.
- **Version.** The current version, with a short change log.
- **Change rule.** Who may change it, who must agree, and the deploy order.

Contracts are versioned here so a change is coordinated and never silent. A
consumer reads the version that is current when it builds. Changing a contract
file is a pull request. The decision to change it is logged in
`decisions/DECISIONS.md`.

One file per contract, named by topic, for example
`<producer>-<consumer>-contract.md`.
