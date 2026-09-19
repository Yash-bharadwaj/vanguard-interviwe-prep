# Vanguard AE-II · Interview OS

Personal interview-preparation system for the **Application Engineer II** interview at Vanguard India (Hyderabad) on **22 Sep 2026**.

## Open it

- **Offline, no install:** double-click `dist/index.html` (single self-contained file, ~1.7 MB). AirDrop / email it to your phone and open it there — progress is saved in that browser.
- **Dev server:** `npm install && npm run dev`
- **Rebuild:** `npm run build` (output: `dist/index.html`)

## Regenerate from the question bank

```
npm run prep     # parse ../All_Questions (1).txt -> src/data/bank.raw.json, then enrich -> src/data/bank.json
npm run build
npm run verify   # proves all 224 questions + 644 follow-ups + 868 answers are in the built app, wording unchanged
```

The parser and enricher never edit question or answer text; they only add analysis fields (category, tags, priority, difficulty, JD/interviewer overlap, resume trigger, duplicate links, EY / unverified-claim / source-conflict flags, interview stage + sequence).

## Where things live

| Path | What |
|---|---|
| `src/data/bank.json` | all 224 questions + 644 follow-ups (verbatim) + analysis fields |
| `src/data/kits-a/b/c.ts` | hand-written **spoken** answers (30-sec, 2-min, simple, ownership, danger, if-I-don't-know) for 83 questions |
| `src/data/conflicts.ts` | the 14 source conflicts (never silently reconciled) |
| `src/data/profile.ts`, `interviewer.ts`, `jd.ts` | resume ownership matrix (A–E), interviewer profile + focus areas, JD requirement map |
| `src/data/anchors.ts`, `deepdive.ts`, `attack.ts`, `why.ts`, `spoken.ts`, `sysdesign.ts`, `study.ts`, `plan45.ts`, `playbook.ts` | anchors, project trees, follow-up chains, why/why-not, behavioral, system design, study sections, 45-minute plan, playbook |

## Honesty rules baked in

- Anything not on your resume is tagged **Needs verification**.
- Two sources that disagree are shown as **SOURCE CONFLICT** (see the Verify page).
- Priority, "likely focus areas" and interviewer relevance are **inferences**, not predictions.
- Mock-interview feedback is **rule-based** (key points, why, trade-offs, ownership) — not an AI judge.
- Questions without a hand-written spoken script show your original bank answer plus an auto-extracted opening, clearly labelled.
