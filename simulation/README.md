# Hearthwork EU — Legislative Simulation

A multi-agent simulation of the Charter's legislative machinery under adversarial conditions.
Each agent plays a state. Claude plays the **ILCB** (Independent Legislative Classification Body) —
classifying proposals, enforcing domain separation, ruling on procedure, and tallying votes.

---

## Participants

| Agent | State | Standing | Role |
|---|---|---|---|
| Agent A | DEU | Member | Burden-sharing advocate |
| Agent B | FRA | Member | Border-security hawk |
| Agent C | ITA | Member | Frontline relief seeker |
| Agent D | POL | Member | Eastern-border funder, anti-quota |
| Agent E | NOR | Companion | Schengen guardian, fiscal contributor |
| Agent F | MAR | Accord State | Transit leverage, legal-pathway seeker |
| **Claude** | — | **ILCB** | Classifier, moderator, rules enforcer |

---

## Turn Structure

1. **Proposal phase** — each active agent submits one `.md` proposal to `proposals/open/`, following the template.
2. **Classification** — Claude (ILCB) reads each proposal and either:
   - Confirms domain and eligible voters, moves file to `proposals/classified/`
   - Returns it as **ultra vires** with written reasons (Assembly-Locked domain, wrong Hestia, etc.)
   - Separates a bundled proposal into two files and classifies each independently
3. **Deliberation** — agents may post written interventions in `session-log.md` before the vote closes.
4. **Vote** — each eligible agent posts their vote in `votes/NNN-slug.md`.
5. **Tally** — Claude tallies the double majority and records the result. File moves to `enacted/` or `rejected/`.
6. **Next round** — agents may submit new proposals informed by what passed.

---

## Proposal Format

See `proposals/_template.md`. Key fields:

```yaml
id: NNN
proposer: XXX          # ISO alpha-3
hestia: [key]          # or "assembly" for Assembly Baseline
title: ...
status: open
```

The proposal body is the legislative text. Keep it precise — the ILCB rules on what the text actually says, not what you intended.

---

## Voting Rules (Charter reference)

**Who votes on a Hestia file:**
- Members and Companions in that Hestia: full vote in Hestia Council + Modular Parliament
- Accord States in that Hestia: Hestia Council vote only (discounted Fiscal Key)
- Non-participants (any standing): no vote; may request Observer Seat (VI.10)

**Double majority required (IV.5):**
- Majority of participating states by count **AND**
- Majority of participating citizens by population

Both must be satisfied. Neither alone suffices.

**Fiscal Key:** assumed paid unless an agent explicitly declares non-payment (triggers Light-Out Clause, VI.4 ¶3).

**External Reach:** if the ILCB classifies a proposal as External Reach, it is transmitted to the Assembly after the Hestia vote. Assembly ratification required before it enters force beyond participants.

---

## Simulation Populations (for double-majority calculation)

These are the active session participants only. Other Gate Hestia members exist but are absent this session.

| State | Population (M) | Gate member | Counts in Gate vote |
|---|---|---|---|
| DEU | 84 | yes | yes |
| FRA | 68 | yes | yes |
| ITA | 59 | yes | yes |
| POL | 37 | yes | yes |
| NOR | 5 | yes | yes (Companion) |
| MAR | 38 | no | no (Accord State, not in Gate) |

Gate Hestia session total: 5 states, 253M citizens.
Double majority threshold: **3 states** and **>126.5M citizens**.

---

## Special Procedures

**Observer Seat request (VI.10):** Any non-participant may request an Observer Seat by posting to `session-log.md`. The ILCB rules on eligibility. Observer status: attend, speak, propose amendments — no vote.

**Companion Suspensive Veto (VII.5):** NOR, as an affected Companion, may invoke a pause on any External Reach ratification proceeding by posting to `session-log.md`. Pause duration: 6 months (one round in simulation time).

**ILCB challenge:** Any agent may challenge a classification through `session-log.md`. The ILCB issues a written ruling.

---

## Win Conditions

There are no formal win conditions — the simulation is open-ended. Agents succeed by getting their legislative objectives enacted. The simulation tests whether the Charter's mechanisms hold under adversarial pressure.

At session end, Claude will publish a debrief in `session-log.md` identifying: bundling attempts, classification rulings, External Reach triggers, coalition patterns, and any architectural gaps exposed.
