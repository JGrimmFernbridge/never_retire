import { useEffect, useState } from 'react';

// ── Two people, one moment (Chapter 4) ───────────────────────────────────────
const moments = {
  1890: {
    sixty: 'Grew up agrarian. Work wasn’t a phase of life — it was life. Has never once thought about retiring.',
    twenty: 'Stepping into industrialization at full force. The first generation for whom work becomes a place you go — and who will eventually be told they must leave it.',
  },
  1985: {
    sixty: 'Five years out and knows precisely what he’s getting, because someone put it in writing when he was hired. Cashing in a promise from a different era.',
    twenty: 'Handed a brochure about investment options and told this is better — more freedom, more control. Nobody explains that the shift from defined benefit to defined contribution is a transfer of risk.',
  },
  2025: {
    sixty: 'Generation X. Too young for pensions, too old to fully recover from 2008 and 2020, too honest to pretend the numbers work. Trying to exit a system that no longer functions.',
    twenty: 'Born into a post-2008 world where the crisis isn’t a memory but architecture. Retirement is a historical curiosity — something their grandparents did. Never entered the system at all.',
  },
};
export function TwoPeople() {
  const [year, setYear] = useState(1890);
  const m = moments[year];
  return (
    <figure className="viz twopeople">
      <figcaption>Pick any year. Picture two people in it: one is 60, one is 20.</figcaption>
      <div className="years" role="tablist">
        {[1890, 1985, 2025].map((y) => (
          <button key={y} role="tab" aria-selected={year === y} className={year === y ? 'on' : ''} onClick={() => setYear(y)}>{y}</button>
        ))}
      </div>
      <div className="pair" key={year}>
        <div className="person"><b>60</b><p>{m.sixty}</p></div>
        <div className="person"><b>20</b><p>{m.twenty}</p></div>
      </div>
      <p className="vizline j">The irony of our moment is that the 60-year-old is trying to exit a system that no longer functions, and the 20-year-old never entered it at all.</p>
    </figure>
  );
}

// ── The retirement bubble, 1950–2040 (Chapter 4) ─────────────────────────────
export function Bubble() {
  const [t, setT] = useState(2025);
  const W = 560, H = 230, x0 = 40, x1 = 540, y0 = 200, y1 = 40;
  const X = (yr) => x0 + ((yr - 1950) / 90) * (x1 - x0);
  // cost of retirement: rises steadily, then steeply. value: rises to 1980 then declines.
  const cost = (yr) => { const p = (yr - 1950) / 90; return y0 - (y0 - y1) * Math.pow(p, 1.8); };
  const value = (yr) => { const p = (yr - 1950) / 90; const peak = 0.33; const v = p < peak ? p / peak : 1 - ((p - peak) / (1 - peak)) * 0.85; return y0 - (y0 - y1) * v * 0.72; };
  const path = (f) => Array.from({ length: 46 }, (_, i) => 1950 + i * 2).map((yr, i) => `${i ? 'L' : 'M'}${X(yr).toFixed(1)},${f(yr).toFixed(1)}`).join(' ');
  const cross = 1980;
  return (
    <figure className="viz bubble">
      <figcaption>The bubble: 1950 to 2040. Drag the year.</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cost of retirement rising past its value after about 1980">
        <line x1={x0} y1={y0} x2={x1} y2={y0} className="axis" />
        {[1950, 1980, 2010, 2040].map((yr) => <text key={yr} x={X(yr)} y={y0 + 18} className="tick" textAnchor="middle">{yr}</text>)}
        <path d={path(value)} className="value" />
        <path d={path(cost)} className="cost" />
        <text x={X(1980)} y={value(1980) - 10} className="lbl value" textAnchor="middle">what retirement is worth to people</text>
        <text x={X(2024)} y={cost(2024) - 12} className="lbl cost" textAnchor="end">what it costs</text>
        <line x1={X(t)} y1={y1 - 10} x2={X(t)} y2={y0} className="cursor" />
        <circle cx={X(t)} cy={cost(t)} r="5" className="dotc" />
        <circle cx={X(t)} cy={value(t)} r="5" className="dotv" />
        <text x={X(t)} y={y1 - 14} textAnchor="middle" className="yr">{t}</text>
      </svg>
      <input type="range" min="1950" max="2040" value={t} onChange={(e) => setT(+e.target.value)} aria-label="Year" />
      <p className="vizline c">
        {t < cross ? 'Displacement. Retirement becomes a genuinely new thing — possible only with government support and a specific set of conditions all in place at once.'
          : t < 2008 ? 'The cost has crossed above the value. One of the signs of a bubble is that the value of a thing begins to fall below what it costs.'
          : t < 2030 ? 'Where we are. The cost of retirement has become astronomical, while its actual social and economic value has been declining since about 1980.'
          : 'A long inflation period generally means the correction is severe rather than gentle. When I teach this I draw the bubbles as dinosaurs, so people remember that dinosaurs went extinct.'}
      </p>
    </figure>
  );
}

// ── The three pendulums (Chapter 6) ──────────────────────────────────────────
const pend = [
  { left: 'Wealth', mid: 'Not poverty', right: 'Poverty', leftNote: 'consumes others', rightNote: 'consumes you' },
  { left: 'Individualism', mid: 'Community', right: 'Forced', leftNote: 'on your own', rightNote: 'obligation, guilt, shame' },
  { left: 'Consumer', mid: 'Generativity', right: 'Consumed', leftNote: 'uses things up', rightNote: 'gets used up' },
];
export function Pendulums() {
  const [pos, setPos] = useState([-1, -1, -1]); // -1 left, 0 center, 1 right
  const [touched, setTouched] = useState(false);
  const all = pos.every((p) => p === 0);
  return (
    <figure className="viz pendulums">
      <figcaption>Three pendulums. Each has two ways to fall off. Tap a bob to swing it.</figcaption>
      {pend.map((p, i) => {
        const x = 50 + pos[i] * 38; // percent
        return (
          <div className="pend" key={p.mid}>
            <div className="labels"><span className={pos[i] === -1 ? 'hot' : ''}>{p.left}</span><b className={pos[i] === 0 ? 'hot' : ''}>{p.mid}</b><span className={pos[i] === 1 ? 'hot' : ''}>{p.right}</span></div>
            <div className="arc">
              <button className="bob" style={{ left: `${x}%` }} aria-label={`${p.mid} pendulum, currently ${pos[i] === 0 ? 'centered' : pos[i] < 0 ? p.left : p.right}`}
                onClick={() => { setTouched(true); setPos((s) => s.map((v, j) => j === i ? (v === -1 ? 0 : v === 0 ? 1 : -1) : v)); }} />
            </div>
            <small>{pos[i] === -1 ? p.leftNote : pos[i] === 1 ? p.rightNote : 'the natural order'}</small>
          </div>
        );
      })}
      <p className="vizline j">{all ? 'The middle isn’t a compromise between them. It’s a different thing entirely.' : touched ? 'Both extremes consume. One end consumes others; the other end consumes you.' : 'We spend nearly all our attention warning about one end and almost none on the other.'}</p>
    </figure>
  );
}

// ── Risk bars (Surgeon General) ──────────────────────────────────────────────
export function RiskBars() {
  const rows = [['Heart disease', 29], ['Stroke', 32], ['Dementia (older adults)', 50], ['Premature death', 60]];
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 150); return () => clearTimeout(t); }, []);
  return (
    <figure className="viz riskbars">
      <figcaption>Added risk from social disconnection</figcaption>
      {rows.map(([n, v]) => (
        <div className="rb" key={n}><span>{n}</span><div className="rbrail"><i style={{ width: go ? `${v}%` : 0 }} /></div><b>+{v}%</b></div>
      ))}
      <small>U.S. Surgeon General advisory, 2023. The mortality effect is compared to smoking up to 15 cigarettes a day.</small>
    </figure>
  );
}

// ── Magic Circle, filling as they answer (Chapter 11) ────────────────────────
export const RINGS = ['Income', 'Capital', 'Tax-free', 'Guaranteed', 'Medical', 'Growth', 'Legacy'];
export function ringFill(a, h) {
  return {
    Income: h.floorPct >= 0.7 ? 1 : h.floorPct >= 0.5 ? 0.6 : h.floorPct > 0 ? 0.3 : 0,
    Guaranteed: h.floorPct >= 0.7 ? 1 : h.floorPct >= 0.5 ? 0.6 : h.floorPct > 0 ? 0.3 : 0,
    Capital: (a.capital ?? -1) >= 5 ? 1 : a.capital >= 2 ? 0.6 : a.capital === 0 ? 0.15 : 0,
    Growth: h.growth >= 500000 ? 1 : h.growth >= 250000 ? 0.7 : h.growth > 0 ? 0.4 : 0,
    Medical: (a.medical ?? 0) / 2,
    'Tax-free': (a.taxfree ?? 0) / 2,
    Legacy: a.survivor !== undefined ? a.survivor / 2 : h.couple ? 0 : 0.5,
  };
}
export function MagicCircle({ fill, answered, caption }) {
  const R = 120, cx = 150, cy = 150, n = RINGS.length;
  const seg = (i, inner, outer) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.03, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.03;
    const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(inner, a0)} A${inner},${inner} 0 0 1 ${p(inner, a1)} L${p(outer, a1)} A${outer},${outer} 0 0 0 ${p(outer, a0)} Z`;
  };
  return (
    <figure className="viz circle">
      {caption && <figcaption>{caption}</figcaption>}
      <svg viewBox="0 0 300 300" role="img" aria-label="Magic Circle: seven rings">
        {RINGS.map((r, i) => {
          const f = fill[r] ?? 0;
          const asked = answered.has(r);
          return (
            <g key={r}>
              <path d={seg(i, 58, R)} className="ringbg" />
              <path d={seg(i, 58, 58 + (R - 58) * f)} className={'ringfill' + (asked ? '' : ' unknown')} />
              <text x={cx + (R + 16) * Math.cos((i + 0.5) / n * Math.PI * 2 - Math.PI / 2)} y={cy + (R + 16) * Math.sin((i + 0.5) / n * Math.PI * 2 - Math.PI / 2)} textAnchor="middle" dominantBaseline="middle" className={'ringlbl' + (asked ? ' on' : '')}>{r}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="46" className="hub" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="hubt">a life</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="hubs">seven jobs</text>
      </svg>
    </figure>
  );
}

// ── $1,000 into one vs $800 into four (Chapter 11) ───────────────────────────
export function SplitTest() {
  const [four, setFour] = useState(false);
  return (
    <figure className="viz split">
      <figcaption>Same household. Two ways to fund a month.</figcaption>
      <div className="toggle" role="tablist">
        <button role="tab" aria-selected={!four} className={!four ? 'on' : ''} onClick={() => setFour(false)}>$1,000 into one</button>
        <button role="tab" aria-selected={four} className={four ? 'on' : ''} onClick={() => setFour(true)}>$800 into four</button>
      </div>
      <div className="jars">
        {['Growth', 'Capital', 'Guaranteed', 'Medical'].map((j, i) => (
          <div className="jar" key={j}>
            <div className="glass"><i style={{ height: four ? '55%' : i === 0 ? '100%' : '0%' }} /></div>
            <span>{j}</span>
          </div>
        ))}
      </div>
      <p className="vizline j">{four
        ? 'On a statement it looks like less. In a life, four jobs are getting done — and a bad year in one of them isn’t a bad year for all of them.'
        : 'The industry will tell you this looks better. On a statement, it does. One job done brilliantly; three left to chance.'}</p>
    </figure>
  );
}

// ── Moneyball (Chapter 11) ───────────────────────────────────────────────────
export function Moneyball() {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 150); return () => clearTimeout(t); }, []);
  return (
    <figure className="viz moneyball">
      <figcaption>2002. Same 103 wins.</figcaption>
      <div className="mb">
        <div className="team"><span>New York Yankees</span><div className="mbrail"><i style={{ width: go ? '100%' : 0 }} /></div><b>$125M payroll · ~$1.2M per win</b></div>
        <div className="team"><span>Oakland A’s</span><div className="mbrail"><i className="as" style={{ width: go ? '32%' : 0 }} /></div><b>$40M payroll · ~$388K per win</b></div>
      </div>
      <p className="vizline j">They didn’t manage it by finding a cheaper superstar. They managed it by asking a different question. You can’t win baseball games — or your financial life — without a variety of players, because what you’re really buying is hits.</p>
    </figure>
  );
}

// ── Three circles, the sweet spot (the principles) ───────────────────────────
export function ThreeCircles({ pr }) {
  const s = { strong: 1, forming: 0.6, thin: 0.25 };
  const c = [
    { k: 'notPoverty', n: 'Not poverty', q: 'what', cx: 110, cy: 95 },
    { k: 'community', n: 'Community', q: 'who', cx: 190, cy: 95 },
    { k: 'generativity', n: 'Generativity', q: 'how', cx: 150, cy: 165 },
  ];
  const all = c.every((x) => pr[x.k] === 'strong');
  return (
    <figure className="viz three">
      <svg viewBox="0 0 300 260" role="img" aria-label="Three overlapping circles: not poverty, community, generativity">
        {c.map((x) => <circle key={x.k} cx={x.cx} cy={x.cy} r="70" className={'pc ' + pr[x.k]} style={{ opacity: 0.25 + s[pr[x.k]] * 0.45 }} />)}
        {c.map((x) => <text key={x.k + 't'} x={x.cx + (x.cx - 150) * 0.9} y={x.cy + (x.cy - 118) * 0.95} textAnchor="middle" className="pct">{x.n}<tspan x={x.cx + (x.cx - 150) * 0.9} dy="14" className="pcq">the {x.q} · {pr[x.k]}</tspan></text>)}
        <text x="150" y="125" textAnchor="middle" dominantBaseline="middle" className={'x' + (all ? ' lit' : '')}>✕</text>
      </svg>
      <p className="vizline j">{all ? 'The X at the centre is the sweet spot where they are all working at once.' : 'The X at the centre is the sweet spot where they are all working at once. The dimmer circles are where the building is.'}</p>
    </figure>
  );
}

// ── The five Social Determinants of Health (HHS / Healthy People 2030) ───────
export const SDOH = [
  { key: 'p_econ',   name: 'Economic stability',               short: 'Economic\nstability',   def: 'Steady income and the ability to afford housing, food and health care. Poverty, job loss and debt all sit here.' },
  { key: 'p_learn',  name: 'Education access and quality',     short: 'Education',             def: 'Access to good schooling and the chance to keep learning across a life — strongly tied to income and to health later on.' },
  { key: 'p_care',   name: 'Health care access and quality',   short: 'Health care',           def: 'Coverage, a doctor you can actually reach, and care that is timely and competent — including care when you can no longer care for yourself.' },
  { key: 'p_place',  name: 'Neighborhood and built environment', short: 'Neighborhood',        def: 'Safe housing, clean air and water, transportation, and places to gather and move — the physical world you live in.' },
  { key: 'p_people', name: 'Social and community context',     short: 'Social &\ncommunity',   def: 'Relationships, belonging, civic life and support — the people who know your name. Two of the five are really community by another name.' },
];
export function SdohWheel({ answers = {}, live = false }) {
  const [sel, setSel] = useState(null);
  const n = 5, cx = 180, cy = 150, R = 112, r = 48;
  const maxes = { p_econ: 3, p_learn: 2, p_care: 3, p_place: 2, p_people: 3 };
  const seg = (i, inner, outer) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.035, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.035;
    const p = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
    return `M${p(inner, a0)} A${inner},${inner} 0 0 1 ${p(inner, a1)} L${p(outer, a1)} A${outer},${outer} 0 0 0 ${p(outer, a0)} Z`;
  };
  const d = sel !== null ? SDOH[sel] : null;
  return (
    <figure className="viz sdoh">
      <figcaption>{live ? 'The five, from what you told me.' : 'The five Social Determinants of Health. Tap one.'}</figcaption>
      <svg viewBox="0 0 360 300" role="img" aria-label="Five social determinants of health arranged around health">
        {SDOH.map((s, i) => {
          const v = answers[s.key]; const f = live && v !== undefined ? v / maxes[s.key] : 0;
          const mid = (i + 0.5) / n * Math.PI * 2 - Math.PI / 2;
          const lx = cx + (R + 22) * Math.cos(mid), ly = cy + (R + 18) * Math.sin(mid);
          const lines = s.short.split('\n');
          return (
            <g key={s.key} className={'sd' + (sel === i ? ' sel' : '')} onClick={() => setSel(sel === i ? null : i)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSel(sel === i ? null : i)}>
              <path d={seg(i, r, R)} className="sdbg" />
              {live && <path d={seg(i, r, r + (R - r) * f)} className="sdfill" />}
              <text x={lx} y={ly - (lines.length - 1) * 6} textAnchor="middle" dominantBaseline="middle" className="sdlbl">
                {lines.map((t, k) => <tspan key={k} x={lx} dy={k ? 12 : 0}>{t}</tspan>)}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={r - 6} className="hub" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" className="hubt">health</text>
      </svg>
      {d ? (
        <p className="vizline c" key={sel}><b>{d.name}.</b> {d.def}</p>
      ) : (
        <p className="vizline c">{live
          ? 'Public health research has found these conditions shape health more than genetics or medical care does. The same is true of your economic life.'
          : 'Where we’re born, grow, work, live and age — and the wider forces shaping daily life. The U.S. Department of Health and Human Services names five.'}</p>
      )}
      <small className="vizsrc">U.S. HHS, Healthy People 2030 · WHO Commission on Social Determinants of Health</small>
    </figure>
  );
}

// ── 100 people, a $400 surprise (Federal Reserve SHED 2024) ─────────────────
export function Hundred() {
  const [mode, setMode] = useState(400);
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);
  const k = mode === 400 ? 37 : 30;
  return (
    <figure className="viz hundred">
      <figcaption>One hundred American adults.</figcaption>
      <div className="toggle" role="tablist">
        <button role="tab" aria-selected={mode === 400} className={mode === 400 ? 'on' : ''} onClick={() => setMode(400)}>A $400 surprise</button>
        <button role="tab" aria-selected={mode === 3} className={mode === 3 ? 'on' : ''} onClick={() => setMode(3)}>Three months without income</button>
      </div>
      <div className="grid100" aria-label={`${k} of 100 people highlighted`}>
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={go && i < k ? 'hit' : ''} style={{ transitionDelay: `${(i % 10) * 25 + Math.floor(i / 10) * 15}ms` }} />)}
      </div>
      <p className="bigstat"><b>{k}</b>{mode === 400 ? ' couldn’t pay it from cash, savings or a card they pay off.' : ' couldn’t cover three months of expenses by any means.'}</p>
      <small className="vizsrc">Federal Reserve, Economic Well-Being of U.S. Households in 2024 (May 2025).</small>
    </figure>
  );
}

// ── There is no switch at 65 ─────────────────────────────────────────────────
export function NoSwitch() {
  const [tries, setTries] = useState(0);
  const [now, setNow] = useState(false);
  const bars = ['Not poverty', 'Community', 'Generativity'];
  return (
    <figure className="viz noswitch">
      <figcaption>The switch most plans are counting on.</figcaption>
      <div className="switchrow">
        <button className={'bigswitch' + (tries ? ' shake' : '')} key={tries} onClick={() => setTries((t) => t + 1)} aria-label="Flip the switch at 65">
          <span className="knob" /><b>65</b>
        </button>
        <p className="vizline c">{tries === 0 ? 'Flip it.' : tries === 1 ? 'Nothing. Try again.' : 'There’s no switch. There’s only what you’ve been building, or not building, the whole time.'}</p>
      </div>
      <div className="lifeline">
        <div className="ages"><span>20</span><span>35</span><span>50</span><span>65</span><span>80</span></div>
        {bars.map((b) => (
          <div className="lb" key={b}><span>{b}</span><div className="lbrail"><i style={{ width: now ? '100%' : '0%' }} /></div></div>
        ))}
      </div>
      <button className="startnow" onClick={() => setNow((v) => !v)}>{now ? 'Reset' : 'Start building now instead'}</button>
      {now && <p className="vizline j">Community, economic stability, and generativity are tasks for the whole life. They compound the way money does, which means starting matters considerably more than optimizing.</p>}
    </figure>
  );
}

// ── Purpose and mortality (JAMA Network Open, 2019) ──────────────────────────
export function PurposeBars() {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);
  return (
    <figure className="viz purpose">
      <figcaption>Nearly 7,000 Americans over 50, followed for years. Risk of dying during the study:</figcaption>
      <div className="team"><span>Strongest sense of purpose</span><div className="mbrail"><i className="as" style={{ width: go ? '41%' : 0 }} /></div><b>1×</b></div>
      <div className="team"><span>Weakest sense of purpose</span><div className="mbrail"><i style={{ width: go ? '100%' : 0 }} /></div><b>2.4× — after accounting for health, wealth and depression</b></div>
      <small className="vizsrc">Alimujiang et al., JAMA Network Open (2019), Health and Retirement Study.</small>
    </figure>
  );
}

// ── Most exits aren't chosen (EBRI RCS 2026) ─────────────────────────────────
export function Exits() {
  const [show, setShow] = useState(false);
  const plan = 65;
  return (
    <figure className="viz exits">
      <figcaption>When retirees planned to leave — and when they actually did.</figcaption>
      <div className="grid100 exitsgrid" aria-label="46 of 100 retirees left earlier than planned">
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={show && i < 46 ? 'hit' : ''} style={{ transitionDelay: `${i * 8}ms` }} />)}
      </div>
      {!show ? <button className="startnow" onClick={() => setShow(true)}>Show what actually happened</button>
        : <p className="bigstat"><b>46</b> of 100 retired earlier than planned. The most common reason: a health problem or disability (41%).</p>}
      <small className="vizsrc">EBRI, 2026 Retirement Confidence Survey.</small>
    </figure>
  );
}

// ── Suicide rate by age, men (CDC/NCHS 2022) ─────────────────────────────────
export function AgeBars() {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);
  const rows = [['Men 15–24', 21.6], ['Men 45–64', 29.5], ['Men 75 and older', 43.9]];
  return (
    <figure className="viz agebars">
      <figcaption>Suicide deaths per 100,000, United States, 2022</figcaption>
      {rows.map(([n, v]) => (
        <div className="rb" key={n}><span>{n}</span><div className="rbrail"><i style={{ width: go ? `${(v / 44) * 100}%` : 0 }} /></div><b>{v}</b></div>
      ))}
      <p className="vizline c">Depression is not a normal part of aging — and the highest suicide rate in the country belongs to the men who have been retired the longest.</p>
      <small className="vizsrc">CDC/NCHS Data Brief 509 (2024). If any of this is landing heavily, you can call or text 988 any time.</small>
    </figure>
  );
}

// ── Seven domains, five circles: 35 intersections, the industry checks two ──
export function Domains() {
  const [all, setAll] = useState(false);
  const domains = ['Financial', 'Economic', 'Health', 'Psychological', 'Social', 'Ethical', 'Moral'];
  const circles = ['You', 'Spouse', 'Family', 'Community', 'Society'];
  const checked = (d, c) => d === 0 && c === 0 || d === 1 && c === 0;
  return (
    <figure className="viz domains">
      <figcaption>Retirement touches seven domains across five circles of people. Thirty-five intersections.</figcaption>
      <div className="dgrid" style={{ gridTemplateColumns: `auto repeat(${circles.length}, minmax(0, 1fr))` }}>
        <span />
        {circles.map((c) => <span className="dh" key={c}>{c}</span>)}
        {domains.map((d, i) => (
          <>
            <span className="dr" key={d}>{d}</span>
            {circles.map((c, j) => <i key={d + c} className={(checked(i, j) ? 'ind' : '') + (all ? ' all' : '')} />)}
          </>
        ))}
      </div>
      <button className="startnow" onClick={() => setAll((v) => !v)}>{all ? 'Show what the industry measures' : 'Show what has to work'}</button>
      <p className="vizline j">{all ? 'All thirty-five have to work for this to be a good idea.' : 'The current model examines two of them and declares victory.'}</p>
    </figure>
  );
}
