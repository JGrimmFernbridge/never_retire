# Never Retire — the walk

An interactive, conversational walkthrough of *Never Retire: an old solution to a new problem* by Jonathan Grimm, built for thefuturepoor.com.

Five stations: **Wait…what?!** → **People** (the Social Determinants of Health as how you're living this week) → **Products** (the seven rings of the Magic Circle as how you're planning) → **The shocks** (market, capital, medical, survivor — two ledgers, products and people) → **A life worth living into** (the three principles, the twenty-minute audit, where to go next).

## Edit the words
Everything the reader sees is in `src/content.js`. Shock verdicts are in `src/sim.js`. See `CONTENT.md` for whose words are whose and where every figure comes from.

## Run it
```
npm install
npm run dev
```

## Deploy
Netlify: import this repo; `netlify.toml` sets `npm run build` → `dist`. Same pattern as the other Future Poor sites.

## Brand
Palette "Intellectual Clarity & Trust": Deep Navy `#1A2A3A`, Sage Slate `#4A6B6C`, Warm Ochre `#D4A359`, Alabaster `#FAFAFA`, Soft Pearl `#EFF2F4`, Charcoal `#2D3142`. Type: Fraunces (reading) + Figtree (controls). Dark mode follows the system.

Nothing a reader answers is stored or sent anywhere.
