// Illustrative shock model. Today's dollars, deliberately simple.
// This is NOT Otto's engine; it exists to show the shape of what holds.

export function peopleScore(a) {
  // 0..100 from the five SDOH walks + generativity
  const parts = [
    [a.p_people, 3], [a.p_generative, 2], [a.p_econ, 3],
    [a.p_care, 3], [a.p_place, 2], [a.p_learn, 2],
  ];
  let got = 0, max = 0;
  for (const [v, m] of parts) { if (v !== undefined) { got += v; max += m; } }
  return max ? Math.round((got / max) * 100) : 0;
}

export function household(a) {
  const need = a.need ?? 5500;
  const floorPct = a.floor ?? 0;
  const floor = need * floorPct;            // guaranteed monthly income
  const capital = (a.capital ?? 0) * need;  // reachable dollars
  const growth = a.growth ?? 0;
  const gap = need - floor;                 // monthly gap market/capital must cover
  return {
    need, floorPct, floor, capital, growth, gap,
    ltc: a.medical ?? 0,          // 0 none, 1 partly, 2 covered
    survivor: a.survivor,         // undefined for solo
    couple: a.household !== 'solo' && a.household !== 'solo_kids',
    working: a.work !== 'notwork',
  };
}

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const months = (m) => (m >= 24 ? `${Math.round(m / 12)} years` : `${Math.round(m)} month${Math.round(m) === 1 ? '' : 's'}`);

export const shocks = [
  {
    id: 'market',
    name: 'Market shock',
    tag: 'The market falls 35% — the year you need the money.',
    run(h, people) {
      const lost = h.growth * 0.35;
      const after = h.growth - lost;
      // Months before you must sell Growth at the bottom: capital covers the gap.
      const runway = h.gap > 0 ? h.capital / h.gap : Infinity;
      const forced = h.gap > 0 && runway < 18;
      const annualGap = h.gap * 12;
      const drawRate = after > 0 && annualGap > 0 ? (annualGap / after) * 100 : 0;
      const zone = drawRate === 0 ? 'none' : drawRate < 4 ? 'room' : drawRate <= 6 ? 'pressure' : 'violation';
      return {
        hit: money(lost),
        hitLabel: 'wiped from Growth on paper',
        products: [
          { name: 'Growth', before: h.growth, after, note: `${money(h.growth)} → ${money(after)}` },
          { name: 'Capital', before: h.capital, after: Math.max(0, h.capital - Math.min(h.capital, h.gap * 18)), note: h.gap > 0 ? `covers the ${money(h.gap)}/mo gap for ${runway === Infinity ? 'as long as needed' : months(runway)}` : 'nothing to cover — the floor holds the need' },
          { name: 'Floor', before: h.floor, after: h.floor, note: h.floor > 0 ? `${money(h.floor)}/mo keeps arriving, untouched` : 'no guaranteed income arrives' },
        ],
        verdict: h.gap <= 0
          ? 'Your floor covers the whole need. The crash is a headline, not an event. Growth gets time to recover.'
          : forced
            ? `Your reachable money runs out in ${months(runway)}. After that you’re selling Growth at the bottom — the one move that turns a correction into a permanent loss. Required draw on what’s left: ${drawRate.toFixed(1)}% a year.`
            : `Capital carries the gap for ${months(runway)}, long enough for most recoveries. You never have to sell low. Draw on Growth afterward: ${drawRate.toFixed(1)}% a year (${zone === 'room' ? 'breathing room' : zone === 'pressure' ? 'under pressure' : 'a fundamental violation'}).`,
        people: people >= 60
          ? 'A household that isn’t alone can also lower the need for a season — shared meals, a spare room, work found through people who know you. That’s a floor too, and it doesn’t show up on a statement.'
          : 'With thin community, the whole shock lands on the balance sheet. There’s no one to lower the need with, and no one who hears you’re looking before the posting goes up.',
        quote: { t: 'In 2008 we joked that the 401(k) had become a 201(k). How do you plan around a 50% drop? And what do you do if that happens to be the year you need the money?', by: 'J' },
      };
    },
  },
  {
    id: 'capital',
    name: 'Capital shock',
    tag: 'A $14,000 surprise: the roof, the transmission, the deductible, the flight home.',
    run(h, people) {
      const bill = 14000;
      const fromCapital = Math.min(h.capital, bill);
      const rest = bill - fromCapital;
      const fromGrowth = Math.min(h.growth, rest);
      const debt = rest - fromGrowth;
      // Rough: a taxable/penalized early withdrawal costs ~30% more to net the same cash
      const growthCost = fromGrowth > 0 && h.working ? fromGrowth * 1.3 : fromGrowth;
      return {
        hit: money(bill),
        hitLabel: 'due this month',
        products: [
          { name: 'Capital', before: h.capital, after: h.capital - fromCapital, note: fromCapital > 0 ? `pays ${money(fromCapital)}` : 'nothing reachable' },
          { name: 'Growth', before: h.growth, after: h.growth - fromGrowth, note: fromGrowth > 0 ? `forced to give up ${money(growthCost)} to net ${money(fromGrowth)}` : 'untouched' },
          { name: 'Debt', before: 0, after: debt, note: debt > 0 ? `${money(debt)} goes on a card` : 'none' },
        ],
        verdict: rest === 0
          ? 'Capital does exactly its job. Nobody sells anything, nobody borrows, and the plan doesn’t notice.'
          : debt > 0
            ? `Reachable money covers ${money(fromCapital)}. ${money(debt)} becomes debt at card rates — the start of the ride most households never chose to get on.`
            : `Reachable money covers ${money(fromCapital)}; the rest is pulled from Growth, with taxes and penalties on top. The surprise cost more than the surprise.`,
        people: people >= 60
          ? 'This is also the shock community absorbs most often: the friend with a truck, the neighbor who knows a roofer, a parent who floats it interest-free. A $14,000 problem inside a web of people is often a $6,000 problem.'
          : 'Without people, the full bill is the bill. Nobody knows a guy, and nobody can float it.',
        quote: { t: 'When you ask which financial tool is best for that kind of thing happening in a life, the answer isn’t a 401(k). It’s probably homeowner’s insurance.', by: 'J' },
      };
    },
  },
  {
    id: 'medical',
    name: 'Medical shock',
    tag: 'Three years of care at home, around $125,000 a year.',
    run(h, people) {
      const total = 375000;
      const coverage = h.ltc === 2 ? total : h.ltc === 1 ? total * 0.5 : 0;
      let rest = total - coverage;
      const fromCapital = Math.min(h.capital, rest); rest -= fromCapital;
      const fromGrowth = Math.min(h.growth, rest); rest -= fromGrowth;
      const uncovered = rest;
      return {
        hit: money(total),
        hitLabel: 'of care over three years',
        products: [
          { name: 'Medical tool', before: coverage, after: 0, note: coverage > 0 ? `pays ${money(coverage)}` : 'nothing in the ring' },
          { name: 'Capital', before: h.capital, after: h.capital - fromCapital, note: fromCapital > 0 ? `drained by ${money(fromCapital)}` : 'untouched' },
          { name: 'Growth', before: h.growth, after: h.growth - fromGrowth, note: fromGrowth > 0 ? `drained by ${money(fromGrowth)}` : 'untouched' },
          ...(uncovered > 0 ? [{ name: 'Unfunded', before: 0, after: uncovered, note: `${money(uncovered)} falls on family or Medicaid spend-down` }] : []),
        ],
        verdict: h.ltc === 2
          ? 'The Medical ring pays. Capital and Growth stay intact for the person still living in the house. This is why the method gives Medical early priority — it’s the wall that frees everything else.'
          : uncovered > 0
            ? `Everything reachable is gone and ${money(uncovered)} is still unfunded. In practice that means a daughter leaves her job, or the house is sold, or care is simply not received.`
            : `The bill is paid — by emptying ${money(fromCapital + fromGrowth)} that was supposed to be a life. What’s left has to carry everything else.`,
        people: people >= 60
          ? 'Most care in America is given by people who love you, unpaid. A real community doesn’t replace coverage, but it decides whether care is a shared season or one person’s collapse.'
          : 'With no one close by, care becomes a purchase at full price — or it doesn’t happen.',
        quote: { t: 'Unplanned medical costs are a leading reason later-life assets drain. Most people, and many advisors, raise the subject only when it is already late.', by: 'J~' },
      };
    },
  },
  {
    id: 'survivor',
    name: 'Survivor shock',
    tag: 'One of you dies. The other keeps living — on what?',
    solo: 'You told me it’s just you. For a single household this shock turns the other way: who is harmed if your income stops, and who would carry your affairs? For couples, press it to see the cliff.',
    run(h, people) {
      // Need drops ~20%, guaranteed floor drops ~33% (one SS check ends), earned income may vanish.
      const need2 = h.need * 0.8;
      const floor2 = h.floor * 0.67;
      const gap2 = need2 - floor2;
      const benefit = h.survivor === 2 ? 500000 : h.survivor === 1 ? 150000 : 0;
      const years = gap2 > 0 ? (h.growth + h.capital + benefit) / (gap2 * 12) : Infinity;
      return {
        hit: money(h.floor - floor2) + '/mo',
        hitLabel: 'of guaranteed income disappears',
        products: [
          { name: 'Need', before: h.need, after: need2, note: `${money(h.need)} → ${money(need2)} a month — one person doesn’t cost half` },
          { name: 'Floor', before: h.floor, after: floor2, note: `${money(h.floor)} → ${money(floor2)} a month` },
          { name: 'Death benefit', before: 0, after: benefit, note: benefit > 0 ? `${money(benefit)} arrives tax-free` : 'none arrives' },
        ],
        verdict: gap2 <= 0
          ? 'The survivor’s floor still covers the survivor’s need. Grief is not also a financial emergency.'
          : years === Infinity || years > 30
            ? `A gap of ${money(gap2)} a month opens — and the death benefit plus what’s left can carry it for the rest of a life.`
            : `A gap of ${money(gap2)} a month opens. Everything reachable lasts about ${years < 1 ? 'less than a year' : Math.round(years) + ' years'}. This is the survivor cliff — and it falls hardest on women.`,
        people: people >= 60
          ? 'Here the people ledger is the whole ledger. Widowhood is the moment isolation usually begins. A table that still has your name on it is the difference between grieving and disappearing.'
          : 'With a thin circle, the survivor loses the one person they talked to — and a quarter of older adults were already isolated before anything happened.',
        quote: { t: 'Every insurance carrier takes all of our money, makes a large pool of it, and pays out to those of us who need it. That’s a community mechanism wearing a corporate suit.', by: 'J' },
      };
    },
  },
];

export function principles(a, h, people) {
  // Qualitative read on the three Natural Order principles
  const floorOK = h.floorPct >= 0.5 || (a.p_econ ?? 0) >= 2;
  const notPoverty = floorOK && (a.capital ?? 0) >= 2 ? 'strong' : floorOK || (a.capital ?? 0) >= 2 ? 'forming' : 'thin';
  const commScore = (a.p_people ?? 0) + (a.p_place ?? 0);
  const community = commScore >= 4 ? 'strong' : commScore >= 2 ? 'forming' : 'thin';
  const genScore = (a.p_generative ?? 0) + (a.p_learn ?? 0);
  const generativity = genScore >= 3 ? 'strong' : genScore >= 2 ? 'forming' : 'thin';
  return { notPoverty, community, generativity, people };
}

export const fmt = { money, months };
