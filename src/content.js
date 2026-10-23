// ─────────────────────────────────────────────────────────────────────────────
// NEVER RETIRE — walkthrough content
//
// Everything the reader sees lives in this file so Jonathan can edit it
// without touching the app. Each line of J's voice carries a `by` tag:
//   by: 'J'   = Jonathan's own words (verbatim or lightly trimmed from
//               Never Retire Draft 2, the SDOH notes, "Faith over Government",
//               "Why Never Retire Now", or the Otto method)
//   by: 'J~'  = Jonathan's idea, paraphrased for the screen
//   by: 'C'   = connective tissue written for the walkthrough (edit freely)
// Data lines carry a `src` with a public source. See CONTENT.md for the map.
// ─────────────────────────────────────────────────────────────────────────────

export const stations = [
  { id: 'open',     label: 'Wait…what?!' },
  { id: 'people',   label: 'People' },
  { id: 'products', label: 'Products' },
  { id: 'shocks',   label: 'The shocks' },
  { id: 'life',     label: 'A life worth living into' },
];

// Each step is either a `say` (J talks) or an `ask` (reader answers).
// `ask` options carry: value, label, and optional `score` buckets used later.
// `say` entries can be an array of paragraphs; each paragraph {t, by, src?}.

export const script = {
  // ── STATION 0 ──────────────────────────────────────────────────────────────
  open: [
    { type: 'say', auto: 1800, lines: [
      { t: 'Never retire.', by: 'J', big: true },
      { t: 'The end.', by: 'J', big: true },
    ]},
    { type: 'say', lines: [
      { t: 'Wait…what?!', by: 'J', big: true, accent: true },
    ]},
    { type: 'say', lines: [
      { t: 'That was my daughter’s response. Two words, delivered with the particular incredulity that only a child can manage when an adult has said something that doesn’t compute.', by: 'J' },
      { t: 'You may have had something like it yourself. Never retire? That sounds less like financial advice and more like a threat.', by: 'J' },
      { t: 'I understand. It sounded that way to me for a while, too. Give me a few pages before you decide.', by: 'J' },
    ]},
    { type: 'say', lines: [
      { t: 'This is not a book that tells you to work until you die. Rest is good. Rest is necessary. Questioning retirement is not the same as questioning rest. It’s questioning a model — one specific, historically contingent, 130-year-old model that was never designed for what we’re now asking it to do.', by: 'J' },
    ]},
    { type: 'say', lines: [
      { t: 'So instead of a calculator, this is a conversation. About ten minutes. I’ll ask how you’re living and planning right now — the people in your life and the products in your plan — and then we’ll see what holds when life does what life does.', by: 'C' },
      { t: 'Nothing you answer is saved or sent anywhere. It stays on this screen.', by: 'C', small: true },
    ]},
    { type: 'ask', id: 'age', q: { t: 'First, where are you on the road?', by: 'C' }, options: [
      { value: 'u35', label: 'Under 35' },
      { value: '35_49', label: '35 to 49' },
      { value: '50_64', label: '50 to 64' },
      { value: '65p', label: '65 or better' },
    ]},
    { type: 'ask', id: 'household', q: { t: 'And who’s in the household?', by: 'C' }, options: [
      { value: 'solo', label: 'Just me' },
      { value: 'couple', label: 'Me and a partner' },
      { value: 'family', label: 'Partner and kids at home' },
      { value: 'solo_kids', label: 'Me and kids' },
    ]},
    { type: 'ask', id: 'work', q: { t: 'How does income arrive today?', by: 'C' }, options: [
      { value: 'job', label: 'A job (W-2)' },
      { value: 'self', label: 'My own business or 1099 work' },
      { value: 'mixed', label: 'A mix of work and other sources' },
      { value: 'notwork', label: 'I’m no longer working for pay' },
    ]},
    { type: 'say', lines: [
      { t: 'Good. Hold onto this idea while we walk:', by: 'C' },
      { t: 'There are three principles that seem to make a human life work. Economic stability, which I’ll call not poverty. Community. And generativity.', by: 'J' },
      { t: 'These are not things you can turn on later in life. If they haven’t been part of your life in the run-up to 65, you’ll find them genuinely difficult to locate afterward. The switch you may be counting on flipping at 65 isn’t there. There’s no switch. There’s only what you’ve been building, or not building, the whole time.', by: 'J' },
    ]},
  ],

  // ── STATION 1: PEOPLE ──────────────────────────────────────────────────────
  people: [
    { type: 'say', lines: [
      { t: 'If you want to know what produces economic stability, it turns out you shouldn’t ask a financial advisor. You should ask a public health researcher.', by: 'J' },
      { t: 'The Social Determinants of Health are the five things that predict how a human life goes: economic stability, access to and quality of health care, the built environment, access to and quality of education, and social and community context.', by: 'J' },
      { t: 'Notice what’s on that list, and notice what isn’t. Your asset allocation isn’t there. Neither is your expense ratio.', by: 'J' },
      { t: 'Public health research has found these conditions shape health more than genetics or access to medical care does.', by: 'C', src: { label: 'CDC, Social Determinants of Health', url: 'https://www.cdc.gov/about/sdoh/index.html' } },
    ]},
    { type: 'say', lines: [
      { t: 'So let’s walk the five — not as a worksheet, but as how you’re actually living this week.', by: 'C' },
    ]},

    // SDOH 1 — Social & community context
    { type: 'ask', id: 'p_people', sdoh: 'Social and community context',
      q: { t: 'In a normal week, how many times are you with people you chose — people who would notice if you didn’t show up?', by: 'C' },
      options: [
        { value: 0, label: 'Honestly, none' },
        { value: 1, label: 'About once' },
        { value: 2, label: 'Two or three times' },
        { value: 3, label: 'Most days' },
      ]},
    { type: 'reflect', on: 'p_people', lines: {
      low: [
        { t: 'Thank you for the honest answer. You’re in large company: before the pandemic, about one in four Americans 65 and older were already socially isolated.', by: 'C', src: { label: 'National Academies, 2020', url: 'https://nap.nationalacademies.org/catalog/25663' } },
        { t: 'You can’t spend four decades slowly withdrawing from your relationships and then retire into a rich community; there’s nothing there to retire into.', by: 'J' },
      ],
      high: [
        { t: 'That rhythm is doing more for your future than most accounts will. Regular rhythms of togetherness foster social and community context. More frequent and closer participation provides a more regular and closer proximity than seeing your favorite team or band on the occasional basis.', by: 'J' },
      ],
    }},
    { type: 'say', lines: [
      { t: 'The U.S. Surgeon General put numbers on what disconnection does to a body: a 29% higher risk of heart disease, 32% higher risk of stroke, and about 50% higher risk of dementia for older adults. The mortality effect is compared to smoking up to 15 cigarettes a day.', by: 'C', src: { label: 'U.S. Surgeon General, Our Epidemic of Loneliness and Isolation (2023)', url: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf' } },
      { t: 'Which is why, in our own practice, we ask about this before we ask about accounts.', by: 'J' },
    ]},

    // Generativity (Jonathan's third principle, sitting inside community)
    { type: 'ask', id: 'p_generative', sdoh: 'Generativity',
      q: { t: 'Is anyone, right now, learning something from you — a kid, a crew, a newer colleague, a neighbor?', by: 'C' },
      options: [
        { value: 0, label: 'Not really' },
        { value: 1, label: 'In small ways' },
        { value: 2, label: 'Yes, regularly' },
      ]},
    { type: 'reflect', on: 'p_generative', lines: {
      low: [
        { t: 'Here’s the convergent truth that retirement most obviously violates: each generation must create the conditions for the next generation to flourish. Are you still contributing, or mostly taking? Are you building or depleting?', by: 'J' },
        { t: 'Nearly every society before ours treated aging as a progression. From labor to influence. From doing to teaching. Elder. Sage. Mentor. Matriarch. Counselor. Those are ranks. They aren’t shelves.', by: 'J' },
      ],
      high: [
        { t: 'Then you’ve already found the thing most plans leave out. Never Retire often means stopping the job. It never means stopping the contribution.', by: 'J' },
      ],
    }},
    { type: 'say', lines: [
      { t: 'Among nearly 7,000 Americans over 50, those with the weakest sense of purpose were about 2.4 times as likely to die over the study period as those with the strongest — after accounting for health, wealth and depression.', by: 'C', src: { label: 'Alimujiang et al., JAMA Network Open (2019)', url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2734064' } },
    ]},

    // SDOH 2 — Economic stability
    { type: 'ask', id: 'p_econ', sdoh: 'Economic stability',
      q: { t: 'If work ended tomorrow, without warning, how long could the household carry itself from money you can actually reach?', by: 'C' },
      options: [
        { value: 0, label: 'Less than a month' },
        { value: 1, label: 'One to three months' },
        { value: 2, label: 'Three to six months' },
        { value: 3, label: 'Six months or more' },
      ]},
    { type: 'reflect', on: 'p_econ', lines: {
      low: [
        { t: 'It isn’t your fault. Roughly 17% of your financial life is within your control. The rest is tariffs and egg prices and gas prices and housing markets. We’ve built an entire moral framework around the 17% and named the whole thing personal responsibility.', by: 'J' },
        { t: 'About 37% of U.S. adults could not cover a $400 surprise from cash, and 30% could not cover three months of expenses by any means.', by: 'C', src: { label: 'Federal Reserve, Economic Well-Being of U.S. Households in 2024', url: 'https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-executive-summary.htm' } },
      ],
      high: [
        { t: 'That floor is the first principle at work. “Not poverty” is a floor rather than a target. And a floor turns out to be a completely different kind of thing to build.', by: 'J' },
      ],
    }},
    { type: 'say', lines: [
      { t: 'Conventional plans assume people stop working when they decide to. In reality many leave sooner than planned: a layoff, skills the market no longer wants, a health event, a family member who needs care. A plan that depends on a voluntary, on-time departure is planning for the exception.', by: 'J~' },
    ]},

    // SDOH 3 — Health care access
    { type: 'ask', id: 'p_care', sdoh: 'Health care access and quality',
      q: { t: 'If you needed help with daily life for three years, who would provide it — and who would pay?', by: 'C' },
      options: [
        { value: 0, label: 'I have no idea' },
        { value: 1, label: 'Family would figure it out' },
        { value: 2, label: 'A mix of family and savings' },
        { value: 3, label: 'A plan and coverage are in place' },
      ]},
    { type: 'reflect', on: 'p_care', lines: {
      low: [
        { t: 'Someone turning 65 today has almost a 70% chance of needing some long-term care in their remaining years. Most of it happens at home, and more than half of it is unpaid care from family.', by: 'C', src: { label: 'U.S. Administration for Community Living', url: 'https://acl.gov/ltc/basic-needs/how-much-care-will-you-need' } },
        { t: 'After housing, medical care is among the largest costs a household faces, yet it is the need people plan for least.', by: 'J~' },
      ],
      high: [
        { t: 'Good. That one is the load-bearing wall — the thing that keeps a health event from draining everything else.', by: 'J~' },
      ],
    }},

    // SDOH 4 — Neighborhood & built environment
    { type: 'ask', id: 'p_place', sdoh: 'Neighborhood and built environment',
      q: { t: 'Is there a place you can get to easily — a table, a hall, a gym, a congregation, a league — where you’re known by name?', by: 'C' },
      options: [
        { value: 0, label: 'No' },
        { value: 1, label: 'One, loosely' },
        { value: 2, label: 'Yes, and I go' },
      ]},
    { type: 'reflect', on: 'p_place', lines: {
      low: [
        { t: 'Robert Putnam studied bowling leagues, of all things, and found social engagement in rapid decline. Bowling leagues, lodges, unions, congregations. That decline runs across roughly the same decades as the retirement bubble’s inflation. We traded social capital for financial capital, and I think we ended up poorer in both.', by: 'J' },
      ],
      high: [
        { t: 'A Dungeons & Dragons table, a crew, a league, a congregation — a structure that only works if everyone shows up and contributes something distinct. Every person is genuinely needed rather than merely included. That’s the tell that it’s generative rather than obligated.', by: 'J' },
      ],
    }},

    // SDOH 5 — Education
    { type: 'ask', id: 'p_learn', sdoh: 'Education access and quality',
      q: { t: 'When did you last learn something hard, on purpose?', by: 'C' },
      options: [
        { value: 0, label: 'Can’t remember' },
        { value: 1, label: 'A few years ago' },
        { value: 2, label: 'This year' },
      ]},
    { type: 'reflect', on: 'p_learn', lines: {
      low: [
        { t: 'It turns out that the best thing for income after 65 is continuing to work — and that’s actually good news. Work provides real social and cognitive benefits, quite apart from the money. But notice I said work, not job.', by: 'J' },
      ],
      high: [
        { t: 'Production. Creativity. Work. Generational. Four expressions of generativity, and only one of them requires a W-2.', by: 'J' },
      ],
    }},

    { type: 'say', lines: [
      { t: 'One more thing about the people side, because it’s where the stakes actually live.', by: 'C' },
      { t: 'Depression is not a normal part of aging. Yet men 75 and older have the highest suicide rate of any group in the country — about 44 deaths per 100,000 in 2022, roughly double the rate for young men.', by: 'C', src: { label: 'CDC / NCHS Data Brief 509 (2024)', url: 'https://www.cdc.gov/nchs/products/databriefs/db509.htm' } },
      { t: 'One British study that followed people into retirement found it raised the probability of clinical depression by about 40% over the medium and long term, with the effect growing the longer retirement lasted.', by: 'C', src: { label: 'Sahlgren, Work Longer, Live Healthier (IEA, 2013)', url: 'https://iea.org.uk/publications/research/work-longer-live-healthier-the-relationship-between-economic-activity-health-and-government-policy' } },
      { t: 'The pattern I’m going to describe — economic instability, isolation, and the loss of a reason to be needed — is a pattern that shortens lives. That isn’t a metaphor about meaning.', by: 'J' },
      { t: 'If any of this is landing heavily right now, you’re not alone, and it’s worth talking to someone. In the U.S. you can call or text 988 any time.', by: 'C', small: true },
    ]},
  ],

  // ── STATION 2: PRODUCTS ────────────────────────────────────────────────────
  products: [
    { type: 'say', lines: [
      { t: 'Now the products. I’ll be brief, because I wrote a whole book about the math.', by: 'J~' },
      { t: 'There is no financial superstar. Every strength brings along its own weakness. You can’t paint a wall with a hammer — not because the hammer is bad, but because it’s the wrong tool for that particular job.', by: 'J' },
      { t: 'There are seven jobs money has to do across a life: Income, Capital, Tax-free, Guarantees, Medical, Growth, Legacy. Every financial tool does some of these and not others. And every tool that doesn’t fill a ring is telling you something by its absence.', by: 'J' },
    ]},
    { type: 'ask', id: 'need', q: { t: 'Roughly what does your household need each month to live — housing, food, the real number?', by: 'C' }, options: [
      { value: 3500, label: 'Around $3,500' },
      { value: 5500, label: 'Around $5,500' },
      { value: 8000, label: 'Around $8,000' },
      { value: 12000, label: '$12,000 or more' },
    ]},

    { type: 'ask', id: 'floor', ring: 'Income + Guaranteed',
      q: { t: 'If you never worked another day, how much of that monthly need would still arrive on its own — pension, Social Security, annuity, rent you collect, a business that runs without you?', by: 'C' },
      options: [
        { value: 0, label: 'Almost none' },
        { value: 0.25, label: 'About a quarter' },
        { value: 0.5, label: 'About half' },
        { value: 0.7, label: 'Most of it (70%+)' },
      ]},
    { type: 'reflect', on: 'floor', lines: {
      low: [
        { t: 'We do not run on the 4% rule. We build a floor first — the goal is that guaranteed income covers roughly 70% of the household’s need — and then stress-test only the remaining gap against market assets. Guaranteed income doesn’t care what the market did this year.', by: 'J~' },
      ],
      high: [
        { t: 'That’s the floor. A household that can’t be forced to sell into a downturn is structurally safer than one relying on a withdrawal percentage.', by: 'J~' },
      ],
    }},

    { type: 'ask', id: 'capital', ring: 'Capital',
      q: { t: 'Money you can reach this week without selling an investment or borrowing — how many months of need is that?', by: 'C' },
      options: [
        { value: 0, label: 'Less than one' },
        { value: 2, label: 'One to three' },
        { value: 5, label: 'Three to six' },
        { value: 9, label: 'Six or more' },
      ]},
    { type: 'reflect', on: 'capital', lines: {
      low: [
        { t: 'Capital — access to money at any time. This is what actually eases anxiety: emergencies, and opportunities. It’s also what keeps you from selling Growth at the bottom.', by: 'J' },
      ],
      high: [
        { t: 'Pooled, reachable money is something close to magic. We just stopped calling it that.', by: 'J~' },
      ],
    }},

    { type: 'ask', id: 'growth', ring: 'Growth',
      q: { t: 'Market money — 401(k), IRA, brokerage — roughly how much, all together?', by: 'C' },
      options: [
        { value: 0, label: 'Essentially none' },
        { value: 60000, label: 'Under $100k' },
        { value: 250000, label: '$100k to $500k' },
        { value: 750000, label: '$500k to $1M' },
        { value: 1500000, label: 'Over $1M' },
      ]},
    { type: 'reflect', on: 'growth', lines: {
      low: [
        { t: 'The median retirement savings in this country is around $30,000. Run that through the 4% rule and it produces about $1,200 a year. A hundred dollars a month. Most of us spend more than that on a phone bill.', by: 'J' },
        { t: 'I don’t share that to frighten anyone. I share it because I think people already sense it and have been carrying it privately.', by: 'J' },
      ],
      high: [
        { t: 'A client comes in with $500,000 in a 401(k). The 4% rule says $20,000 a year. He tells me he needs three times that just to live paycheck to paycheck. It isn’t a problem with the safe withdrawal rate. It’s a problem where the outcome he needs and the strategies we have simply do not meet.', by: 'J' },
      ],
    }},

    { type: 'ask', id: 'medical', ring: 'Medical',
      q: { t: 'If you needed years of care, is there a tool that pays for it — long-term care coverage, a hybrid policy, a dedicated fund?', by: 'C' },
      options: [
        { value: 0, label: 'No' },
        { value: 1, label: 'Partly' },
        { value: 2, label: 'Yes' },
      ]},
    { type: 'reflect', on: 'medical', lines: {
      low: [
        { t: 'Roughly 70% of people who reach 65 will need long-term services and support. In California that can run around $125,000 a year.', by: 'J' },
        { t: 'Long-term care cover may be the most valuable asset most households do not have.', by: 'J~' },
      ],
      high: [
        { t: 'That’s the fourth pillar. It frees everything else to do its own job.', by: 'J~' },
      ],
    }},

    { type: 'ask', id: 'survivor', ring: 'Legacy',
      q: { t: 'If one of you died this year, would the other one’s life keep working — financially — without selling the house or the future?', by: 'C' },
      skipIf: (a) => a.household === 'solo',
      options: [
        { value: 0, label: 'No, it would unravel' },
        { value: 1, label: 'For a while' },
        { value: 2, label: 'Yes — coverage and income are in place' },
      ]},
    { type: 'reflect', on: 'survivor', lines: {
      low: [
        { t: 'Widowed women 65 and older had a poverty rate of about 15.5% in 2021, against 10.3% for all people 65 and older. The household’s Social Security typically drops by roughly a third while expenses don’t fall nearly as far.', by: 'C', src: { label: 'TIAA Institute / Slavov (2026); Center for Retirement Research', url: 'https://www.tiaa.org/content/dam/tiaa/institute/pdf/insights-report/2026-01/ss-widow-poverty-risk-ir.pdf' } },
      ],
      high: [
        { t: 'Legacy — what continues after you. For couples it starts with the survivor, then heirs.', by: 'J~' },
      ],
    }},

    { type: 'ask', id: 'taxfree', ring: 'Tax-free',
      q: { t: 'Last one. Is any of your money tax-free when you spend it — Roth, HSA, cash value?', by: 'C' },
      options: [
        { value: 0, label: 'None' },
        { value: 1, label: 'Some' },
        { value: 2, label: 'A meaningful share' },
      ]},
    { type: 'say', lines: [
      { t: 'Because here’s the question the whole thing comes down to. $1,000 a month into one area, or $800 a month into four? The industry will tell you the first looks better. On a statement, it does. In a life, I’ve come to think it doesn’t.', by: 'J' },
    ]},
  ],

  // ── STATION 3: SHOCKS ──────────────────────────────────────────────────────
  shocks: [
    { type: 'say', lines: [
      { t: 'In January of 2025, our house was in the path of the Eaton Fire.', by: 'J' },
      { t: 'The thing that carried us was not an account balance. I can’t tell you the number of people who helped us this past year. And what it requires — what I hadn’t fully understood until I needed it — is that you have to have all of that in place beforehand in order to make it through. You can’t assemble it during the emergency. You either have it or you don’t.', by: 'J' },
      { t: 'Which is the argument of this entire book, delivered by fire rather than by chapter. I’d have preferred the chapter.', by: 'J' },
    ]},
    { type: 'say', lines: [
      { t: 'So let’s test the life you just described. In our planning software there are four shocks baked in — the four ways a plan actually gets hit. Press each one. You’ll see two ledgers: what your products absorb, and what your people absorb. Both are real money.', by: 'C' },
      { t: 'This is an illustration in today’s dollars, not a plan and not the real engine. The point is the shape, not the decimal.', by: 'C', small: true },
    ]},
    { type: 'shocks' },
    { type: 'say', lines: [
      { t: 'Retirement operates across at least seven domains: financial, moral, ethical, health, social, psychological, and economic. The current model examines two of them and declares victory. It’s a bit like a doctor who checks your cholesterol and blood pressure, ignores everything else, and pronounces you healthy because two numbers came back in range.', by: 'J' },
    ]},
  ],

  // ── STATION 4: A LIFE WORTH LIVING INTO ────────────────────────────────────
  life: [
    { type: 'say', lines: [
      { t: 'You’ll notice the industry’s answer to all of this is a probability — a Monte Carlo simulation with a confidence interval. An 87% chance of success.', by: 'J' },
      { t: 'But notice what that number measures: the probability that a single-variable plan survives. It doesn’t measure whether you have a life worth surviving into.', by: 'J' },
      { t: 'What do I need money for is a far more important question than how much money do I need.', by: 'J', big: true },
    ]},
    { type: 'summary' },
    { type: 'say', lines: [
      { t: 'Three principles. Not poverty. Community. Generativity. They aren’t three separate things. “Not poverty” without community is simply wealth accumulation. Community without generativity becomes obligation. Generativity without “not poverty” becomes exploitation. Take any one out and the other two curdle.', by: 'J' },
      { t: 'This doesn’t work especially well if you try to turn it on late in life. If you’re reading this at 58, that’s not a verdict. It just means the honest version of your plan involves building what you can, where you can, rather than pretending there’s a switch. In my experience, people who start late but start honestly do far better than people who start early and never look up.', by: 'J' },
    ]},
    { type: 'audit' },
    { type: 'say', lines: [
      { t: 'So I hope you won’t wait until 65. There isn’t a switch waiting there. There’s only the life you’re building right now, and whether it’s the kind of life that can hold you when you need it to.', by: 'J' },
      { t: 'Never retire.', by: 'J', big: true },
      { t: 'Start now — wherever now happens to be.', by: 'J' },
    ]},
    { type: 'next' },
  ],
};

// The twenty-minute audit (Chapter 13), rendered as an interactive table.
export const audit = {
  intro: { t: 'Here’s the practical exercise, and it takes about twenty minutes with a cup of coffee. List your accounts. All of them. Now run each across three columns.', by: 'J' },
  columns: [
    { key: 'floor', label: 'Does this create “not poverty”?', hint: 'Does it produce a floor, or only an eventual balance?' },
    { key: 'communal', label: 'Is this communal or individual?', hint: 'Does it pool risk with anyone? Does its name begin with the word Individual?' },
    { key: 'generative', label: 'Is this generative or consumptive?', hint: 'Does it produce something ongoing, or is its design purpose to be used up?' },
  ],
  starters: ['Checking & savings', '401(k) / 403(b)', 'IRA / Roth', 'Brokerage', 'Home', 'Life insurance', 'Pension / Social Security', 'The business'],
  outro: { t: 'Most people finish this and find that nearly everything they own scores in one column and blanks in the other two. This is not a moral failing. It’s precisely what you’d expect from a system that has spent forty years optimizing a single column. But that’s your real financial picture, far more than a net worth statement is.', by: 'J' },
};

export const links = {
  book: { label: 'The Future Poor', url: 'https://thefuturepoor.com' },
  substack: { label: 'The Financial Ethicist on Substack', url: 'https://thefuturepoor.substack.com' },
  fernbridge: { label: 'Talk with Fernbridge Advisors', url: 'https://fernbridge.us' },
  course: { label: 'Natural Order Economics course', url: 'https://naturalordereconomics.netlify.app' },
  story: { label: 'The Story of Retirement', url: 'https://thefuturepoor.com' },
};
