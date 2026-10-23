# Content & attribution map

All reader-facing words live in `src/content.js` (the walk) and `src/sim.js` (the shock verdicts). Every line of J's voice carries a tag so it's always clear whose idea it is.

| Tag | Meaning |
|---|---|
| `J` | Jonathan's own words, verbatim or lightly trimmed |
| `J~` | Jonathan's idea, paraphrased to fit the screen |
| `C` | Connective tissue written for the walkthrough — edit or replace freely |

On screen, `J` and `J~` lines carry the gold left rule. `C` lines don't.

## Where the J lines come from

- **Never Retire — Draft 2 (warmer register)**: the opening ("Never retire. The end." / "Wait…what?!" / daughter), "not a book that tells you to work until you die," the three principles and "there's no switch," the SDOH passage in *Not Poverty*, Putnam and bowling leagues, the D&D table, generativity as progression ("ranks, not shelves"), "stopping the job, never the contribution," the Eaton Fire passage, the seven jobs of money and "you can't paint a wall with a hammer," the $500k client and the void, the $30k median, "$1,000 into one or $800 into four," the seven domains / cholesterol doctor, the Monte Carlo / "life worth surviving into," "what do I need money for," the concatenation ("take any one out and the other two curdle"), "if you're reading this at 58," the twenty-minute audit, the closing lines, the 17% device, "it isn't your fault," the insurance-as-community line, the 201(k) line, and the homeowner's insurance line.
- **The Future Poor — Social Determinants of Health (notes doc)**: the SDOH framing and the five determinants.
- **Faith over Government**: "regular rhythms of togetherness…," closer proximity vs. the occasional concert.
- **Otto method (concept library / advisor training)**: the floor-first philosophy and ~70% floor target, "most exits aren't chosen," Medical as the need planned for least, "the asset most households lack," and the withdrawal-pressure zones (breathing room / under pressure / fundamental violation). These are marked `J~`.

## Public data used (each is linked on screen)

| Figure | Source |
|---|---|
| SDOH shape health more than genetics or medical care | CDC, Social Determinants of Health |
| ~1 in 4 adults 65+ socially isolated (pre-pandemic, ~7.7M) | National Academies, *Social Isolation and Loneliness in Older Adults* (2020) |
| 29% heart disease, 32% stroke, 50% dementia; ≈15 cigarettes/day | U.S. Surgeon General advisory, *Our Epidemic of Loneliness and Isolation* (2023) |
| Lowest purpose ≈2.4× mortality (HR 2.43) among ~7,000 adults 50+ | Alimujiang et al., *JAMA Network Open* (2019) |
| 37% can't cover $400 from cash; 30% can't cover 3 months | Federal Reserve, *Economic Well-Being of U.S. Households in 2024* (May 2025) |
| ~70% of 65-year-olds will need LTC; most at home; 59% unpaid care | U.S. Administration for Community Living, LongTermCare.gov |
| Men 75+ highest suicide rate, ~43.9/100k (2022) | CDC/NCHS Data Brief 509 |
| Retirement raises probability of clinical depression ~40% | Sahlgren, *Work Longer, Live Healthier* (IEA, 2013) — a UK think-tank study; worth noting its advocacy framing |
| Widowed women 65+ poverty 15.5% vs 10.3% all 65+ (2021); ~⅓ drop in Social Security | TIAA Institute / Slavov (2026); Center for Retirement Research |
| $125,000/yr care in California; 70% need LTSS | Jonathan's figure from the manuscript (marked `J`) |

## The shock model (`src/sim.js`)

Deliberately simple, today's dollars, not Otto's engine:

- **Market**: Growth × 0.65. Runway before forced selling = reachable money ÷ monthly gap (need − floor). Draw rate on what's left sorted into the Otto zones (<4%, 4–6%, >6%).
- **Capital**: a $14,000 surprise paid from Capital → Growth (with a ~30% tax/penalty haircut if still working) → debt.
- **Medical**: 3 years × $125,000. Medical tool pays 100% / 50% / 0%, then Capital, then Growth; the remainder is "unfunded."
- **Survivor**: need drops ~20%, guaranteed floor drops ~33%; death benefit of $500k / $150k / $0 by answer; years the gap can be carried.
- **People score**: 0–100 from the six People answers; it changes the People-ledger narrative, never the dollars.

Thresholds to tune are at the top of each `run()`.
