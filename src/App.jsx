import { useEffect, useMemo, useRef, useState } from 'react';
import { stations, script, audit, links } from './content.js';
import { household, peopleScore, shocks, principles, fmt } from './sim.js';
import { TwoPeople, Bubble, Pendulums, RiskBars, MagicCircle, RINGS, ringFill, SplitTest, Moneyball, ThreeCircles, SdohWheel, Hundred } from './visuals.jsx';

// Flatten the script into one ordered list of steps, remembering the station.
const steps = stations.flatMap((s) => script[s.id].map((step) => ({ ...step, station: s.id })));

function isLow(step, value) {
  const vals = step.options?.map((o) => o.value) ?? [];
  const max = Math.max(...vals);
  return value < max * 0.5 + 1e-9;
}

export default function App() {
  const [answers, setAnswers] = useState({});
  const [cursor, setCursor] = useState(0);
  const endRef = useRef(null);
  const reduce = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  // Visible steps: everything up to the cursor, skipping steps whose skipIf says so
  const visible = [];
  for (let i = 0; i <= cursor && i < steps.length; i++) {
    const s = steps[i];
    if (s.skipIf && s.skipIf(answers)) continue;
    if (s.type === 'reflect') {
      const v = answers[s.on];
      if (v === undefined) continue;
    }
    visible.push({ ...s, index: i });
  }
  const current = visible[visible.length - 1];
  const stationId = current?.station ?? 'open';
  const done = cursor >= steps.length - 1;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }, [cursor, reduce]);

  // A beat between "The end." and "Wait…what?!"
  useEffect(() => {
    const s = steps[cursor];
    if (!s?.auto) return;
    const t = setTimeout(() => setCursor((c) => (c === cursor ? c + 1 : c)), s.auto);
    return () => clearTimeout(t);
  }, [cursor]);

  // Advance past reflect/skipped steps automatically
  function advance(from = cursor) {
    let next = from + 1;
    while (next < steps.length) {
      const s = steps[next];
      if (s.skipIf && s.skipIf(answers)) { next++; continue; }
      break;
    }
    setCursor(Math.min(next, steps.length - 1));
  }

  function answer(step, value) {
    const a = { ...answers, [step.id]: value };
    setAnswers(a);
    // move to the next step; reflect steps render with the answer in hand
    let next = step.index + 1;
    while (next < steps.length && steps[next].skipIf && steps[next].skipIf(a)) next++;
    setCursor(Math.min(next, steps.length - 1));
  }

  const h = household(answers);
  const people = peopleScore(answers);

  return (
    <div className="page">
      <Track stationId={stationId} />
      <main className="thread" aria-live="polite">
        {visible.map((s) => (
          <Step key={s.index} step={s} answers={answers} isCurrent={s.index === current.index}
            onAnswer={answer} onContinue={() => advance(s.index)} h={h} people={people} />
        ))}
        {!done && current && current.type !== 'ask' && (
          <button className="continue" onClick={() => advance(current.index)}>
            {current.type === 'shocks' ? 'I’ve seen enough — keep going' : current.type === 'audit' ? 'Finish the walk' : 'Go on'}
          </button>
        )}
        <div ref={endRef} />
      </main>
      <footer className="foot">
        <p>From <em>Never Retire: an old solution to a new problem</em> by Jonathan Grimm, author of <em>The Future Poor</em>. Lines marked with a gold rule are his. Figures link to their sources.</p>
        <p>Educational, not advice. Fiduciary advice is given through Fernbridge Advisors, LLC.</p>
      </footer>
    </div>
  );
}

function Track({ stationId }) {
  const idx = stations.findIndex((s) => s.id === stationId);
  return (
    <nav className="track" aria-label="Progress">
      <span className="brand">Never Retire</span>
      <ol>
        {stations.map((s, i) => (
          <li key={s.id} className={i < idx ? 'past' : i === idx ? 'now' : ''}><span>{s.label}</span></li>
        ))}
      </ol>
    </nav>
  );
}

function Line({ l }) {
  const cls = ['line', l.by === 'J' || l.by === 'J~' ? 'j' : 'c', l.big ? 'big' : '', l.accent ? 'accent' : '', l.small ? 'small' : ''].join(' ');
  return (
    <p className={cls}>
      {l.t}
      {l.src && <> <a className="src" href={l.src.url} target="_blank" rel="noreferrer" title={l.src.label}>source</a></>}
    </p>
  );
}

function Step({ step, answers, isCurrent, onAnswer, onContinue, h, people }) {
  switch (step.type) {
    case 'say':
      return <section className="say">{step.lines.map((l, i) => <Line key={i} l={l} />)}</section>;
    case 'reflect': {
      const v = answers[step.on];
      const src = steps.find((s) => s.id === step.on);
      const lines = isLow(src, v) ? step.lines.low : step.lines.high;
      return <section className="say reflect">{lines.map((l, i) => <Line key={i} l={l} />)}</section>;
    }
    case 'ask':
      return <Ask step={step} value={answers[step.id]} onAnswer={onAnswer} />;
    case 'visual':
      return <Visual id={step.id} answers={answers} h={h} />;
    case 'shocks':
      return <Shocks h={h} people={people} answers={answers} />;
    case 'summary':
      return <Summary answers={answers} h={h} people={people} />;
    case 'audit':
      return <Audit />;
    case 'next':
      return <Next />;
    default:
      return null;
  }
}

function Visual({ id, answers, h }) {
  const answered = new Set();
  if (answers.floor !== undefined) { answered.add('Income'); answered.add('Guaranteed'); }
  if (answers.capital !== undefined) answered.add('Capital');
  if (answers.growth !== undefined) answered.add('Growth');
  if (answers.medical !== undefined) answered.add('Medical');
  if (answers.taxfree !== undefined) answered.add('Tax-free');
  if (answers.survivor !== undefined || !h.couple) answered.add('Legacy');
  switch (id) {
    case 'bubble': return <Bubble />;
    case 'twoPeople': return <TwoPeople />;
    case 'riskBars': return <RiskBars />;
    case 'hundred': return <Hundred />;
    case 'sdohIntro': return <SdohWheel />;
    case 'sdohLive': return <SdohWheel answers={answers} live />;
    case 'pendulums': return <Pendulums />;
    case 'circleIntro': return <MagicCircle fill={{}} answered={new Set()} caption="Seven rings. We’ll fill them as you answer." />;
    case 'circleLive': return <MagicCircle fill={ringFill(answers, h)} answered={answered} />;
    case 'moneyball': return <Moneyball />;
    case 'split': return <SplitTest />;
    default: return null;
  }
}

function Ask({ step, value, onAnswer }) {
  const answered = value !== undefined;
  return (
    <section className="ask">
      {(step.sdoh || step.ring) && <span className="tag">{step.sdoh ? `Social determinant: ${step.sdoh}` : `Ring: ${step.ring}`}</span>}
      <Line l={step.q} />
      <div className="options" role="group">
        {step.options.map((o) => (
          <button key={String(o.value)} className={'opt' + (answered && o.value === value ? ' picked' : '') + (answered && o.value !== value ? ' dim' : '')}
            disabled={answered} onClick={() => onAnswer(step, o.value)}>{o.label}</button>
        ))}
      </div>
    </section>
  );
}

// ── The shocks ───────────────────────────────────────────────────────────────
function Shocks({ h, people, answers }) {
  const [open, setOpen] = useState(null);
  const [pressed, setPressed] = useState({});
  const result = open ? shocks.find((s) => s.id === open) : null;
  const solo = !h.couple;
  const out = result && !(result.id === 'survivor' && solo) ? result.run(h, people) : null;

  function press(id) { setOpen(id); setPressed((p) => ({ ...p, [id]: true })); }

  return (
    <section className="stage">
      <div className="base">
        <div><b>{fmt.money(h.need)}</b><span>a month to live</span></div>
        <div><b>{fmt.money(h.floor)}</b><span>arrives on its own</span></div>
        <div><b>{fmt.money(h.capital)}</b><span>reachable now</span></div>
        <div><b>{fmt.money(h.growth)}</b><span>in the market</span></div>
        <div><b>{people}</b><span>people score / 100</span></div>
      </div>
      <div className="shockrow">
        {shocks.map((s) => (
          <button key={s.id} className={'shock' + (open === s.id ? ' on' : '') + (pressed[s.id] ? ' seen' : '')} onClick={() => press(s.id)}>
            <b>{s.name}</b><span>{s.tag}</span>
          </button>
        ))}
      </div>
      {result && !out && <p className="line c">{result.solo}</p>}
      {out && (
        <div className="result" key={open}>
          <p className="hit"><b>{out.hit}</b> {out.hitLabel}</p>
          <div className="ledgers">
            <div className="ledger">
              <h3>Products ledger</h3>
              {out.products.map((p) => <Bar key={p.name} p={p} />)}
              <p className="verdict">{out.verdict}</p>
            </div>
            <div className="ledger peopleL">
              <h3>People ledger</h3>
              <Dots score={people} />
              <p className="verdict">{out.people}</p>
            </div>
          </div>
          <Line l={out.quote} />
        </div>
      )}
      {!open && <p className="hint">Press a shock to see what gives.</p>}
    </section>
  );
}

function Bar({ p }) {
  const max = Math.max(p.before, p.after, 1);
  const scale = (v) => Math.max(2, (v / max) * 100);
  const grew = p.after > p.before;
  return (
    <div className="bar">
      <div className="barhead"><span>{p.name}</span><small>{p.note}</small></div>
      <div className="rail">
        <i className="before" style={{ width: scale(p.before) + '%' }} />
        <i className={'after' + (grew ? ' grew' : '')} style={{ width: scale(p.after) + '%' }} />
      </div>
    </div>
  );
}

function Dots({ score }) {
  const lit = Math.round((score / 100) * 24);
  return (
    <div className="dots" aria-label={`People score ${score} of 100`}>
      {Array.from({ length: 24 }, (_, i) => <i key={i} className={i < lit ? 'lit' : ''} />)}
    </div>
  );
}

// ── Summary ──────────────────────────────────────────────────────────────────
function Summary({ answers, h, people }) {
  const pr = principles(answers, h, people);
  const sdoh = [
    ['Social and community context', answers.p_people, 3],
    ['Generativity', answers.p_generative, 2],
    ['Economic stability', answers.p_econ, 3],
    ['Health care access', answers.p_care, 3],
    ['Neighborhood and built environment', answers.p_place, 2],
    ['Education', answers.p_learn, 2],
  ];
  return (
    <section className="summary">
      <h2>How you’re living, and how you’re planning</h2>
      <div className="two">
        <div>
          <h3>People</h3>
          <ul className="meter">
            {sdoh.map(([n, v, m]) => <li key={n}><span>{n}</span><Pips v={v ?? 0} m={m} /></li>)}
          </ul>
        </div>
        <div>
          <h3>Products</h3>
          <MagicCircle fill={ringFill(answers, h)} answered={new Set(RINGS)} />
        </div>
      </div>
      <ThreeCircles pr={pr} />
    </section>
  );
}

function Pips({ v, m }) {
  return <span className="pips">{Array.from({ length: m }, (_, i) => <i key={i} className={i < v ? 'on' : ''} />)}</span>;
}

// ── The twenty-minute audit ──────────────────────────────────────────────────
function Audit() {
  const [rows, setRows] = useState(audit.starters.map((n) => ({ name: n, floor: null, communal: null, generative: null })));
  const [draft, setDraft] = useState('');
  const labels = { floor: ['no', 'yes'], communal: ['individual', 'communal'], generative: ['consumptive', 'generative'] };
  function set(i, k) { setRows((r) => r.map((row, j) => j === i ? { ...row, [k]: row[k] === null ? 1 : row[k] === 1 ? 0 : null } : row)); }
  const tallies = audit.columns.map((c) => rows.filter((r) => r[c.key] === 1).length);
  return (
    <section className="audit">
      <Line l={audit.intro} />
      <div className="tablewrap">
        <table>
          <thead><tr><th>Account</th>{audit.columns.map((c) => <th key={c.key} title={c.hint}>{c.label}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                {audit.columns.map((c) => (
                  <td key={c.key}>
                    <button className={'cell ' + (r[c.key] === 1 ? 'yes' : r[c.key] === 0 ? 'no' : '')} onClick={() => set(i, c.key)}>
                      {r[c.key] === null ? '—' : labels[c.key][r[c.key]]}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="tally"><td>Scores in column</td>{tallies.map((t, i) => <td key={i}>{t}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <form className="addrow" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setRows((r) => [...r, { name: draft.trim(), floor: null, communal: null, generative: null }]); setDraft(''); } }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add another account" aria-label="Add another account" />
        <button type="submit">Add</button>
      </form>
      <Line l={audit.outro} />
    </section>
  );
}

function Next() {
  return (
    <section className="next">
      <h2>Where this goes from here</h2>
      <div className="cards">
        <a href={links.fernbridge.url} target="_blank" rel="noreferrer"><b>Bring this to a conversation</b><span>Fernbridge Advisors plans with the floor first and the Magic Circle whole — the same seven rings you just walked.</span></a>
        <a href={links.book.url} target="_blank" rel="noreferrer"><b>Read the math</b><span>The Future Poor lays out why nine in ten of us are on a path to poverty under the old game — and what a new game looks like.</span></a>
        <a href={links.course.url} target="_blank" rel="noreferrer"><b>Go deeper into the philosophy</b><span>The Natural Order Economics course: not poverty, community, generativity, across traditions.</span></a>
        <a href={links.substack.url} target="_blank" rel="noreferrer"><b>Keep walking</b><span>The Financial Ethicist on Substack, where Never Retire is being written in the open.</span></a>
      </div>
      <button className="again" onClick={() => window.location.reload()}>Start the walk over</button>
    </section>
  );
}
