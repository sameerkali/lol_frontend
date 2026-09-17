import React from 'react';

/* Customer page — mobile web, no app, no login.
   Composed entirely from the design-system primitives on window.<Namespace>. */

export function CustomerApp({ ns }) {
  const {
    Button, Card, Badge, Icon, Sticker, PhoneInput, Input, PinPad,
    StampGrid, ProgressBar, MilestoneLadder, RewardCard, TierBadge,
    Toast, Dialog, Celebration, EmptyState, Tabs, BottomBar, TopBar,
  } = ns;

  const MILESTONES = [
    { count: 5, label: 'Free coffee' },
    { count: 10, label: '20% off the bill' },
    { count: 15, label: 'Free dessert' },
  ];

  const [screen, setScreen] = React.useState('lookup'); // lookup | signup | card
  const [tab, setTab] = React.useState('card');
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [visits, setVisits] = React.useState(7);
  const [prev, setPrev] = React.useState(null);
  const [pinOpen, setPinOpen] = React.useState(false);
  const [pinMode, setPinMode] = React.useState('visit');
  const [pin, setPin] = React.useState('');
  const [pinError, setPinError] = React.useState('');
  const [celebrate, setCelebrate] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const [redeemed, setRedeemed] = React.useState([]);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(''), 2200); };

  const target = 15;
  const nextMs = MILESTONES.find((m) => m.count > visits) || MILESTONES[MILESTONES.length - 1];
  const unlocked = MILESTONES.filter((m) => m.count <= visits);

  const openPin = (mode) => { setPinMode(mode); setPin(''); setPinError(''); setPinOpen(true); };

  const completePin = (v) => {
    if (v !== '4821') { setPinError("That PIN didn't match. Try again."); setPin(''); return; }
    setPinOpen(false);
    if (pinMode === 'visit') { markVisit(); }
    else { setRedeemed((r) => [...r, pinMode]); showToast('Reward redeemed'); }
  };

  const markVisit = () => {
    const next = visits + 1;
    setPrev(visits);
    setVisits(next);
    const hit = MILESTONES.find((m) => m.count === next);
    if (hit) setTimeout(() => setCelebrate(hit), 700);
    else showToast('Visit marked');
  };

  const Logo = (
    <span style={{ font: '900 22px/1 var(--font-display)', color: 'var(--ink-900)' }}>KH</span>
  );

  /* ---------- screens ---------- */

  const Lookup = (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Badge tone="info" icon="nfc">Tag tapped</Badge>
        <Badge tone="neutral">Kaapi House</Badge>
      </div>
      <div>
        <h1 style={{ margin: 0, font: 'var(--type-display)', fontSize: 58, letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>
          Your card lives on your phone number.
        </h1>
        <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-muted)', marginTop: 10 }}>
          No app. No password. Type your number and we'll find your stamps.
        </p>
      </div>
      <PhoneInput value={phone} onChange={setPhone} hint="Used only to find your card." />
      <Button size="lg" fullWidth icon="arrow-right" wobble
        onClick={() => setScreen(phone.length === 10 && phone.startsWith('9') ? 'card' : 'signup')}>
        Find my card
      </Button>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
        <Sticker color="var(--mint-500)" size={54} tilt={-8}><Icon name="coffee" size={24} /></Sticker>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
          Numbers starting with 9 are returning customers in this demo.
        </span>
      </div>
    </div>
  );

  const Signup = (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
      <div>
        <h1 style={{ margin: 0, font: 'var(--type-title)', fontSize: 42, letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>
          Start your card
        </h1>
        <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 6 }}>
          Kaapi House asks for a name and birthday. Everything else is optional.
        </p>
      </div>
      <Card tone="mint" pad={16} elevation={1}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Sticker color="var(--paper-000)" size={48} tilt={-6}><Icon name="gift" size={22} /></Sticker>
          <div>
            <div style={{ font: 'var(--type-subtitle)', color: 'var(--text-strong)' }}>2 free stamps to start</div>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>A head start from the café.</div>
          </div>
        </div>
      </Card>
      <Input label="Name" icon="user" value={name} onChange={setName} placeholder="Priya" />
      <Input label="Birthday" icon="cake" placeholder="14 March" hint="We'll send a birthday reward." />
      <Button size="lg" fullWidth onClick={() => { setVisits(2); setPrev(0); setScreen('card'); }}>Create my card</Button>
    </div>
  );

  const CardTab = (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Welcome back</div>
          <div style={{ font: 'var(--type-title)', fontSize: 40, letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>Priya</div>
        </div>
        <TierBadge tier="Silver" size="sm" />
      </div>

      <Card pad={20}>
        <StampGrid total={target} filled={visits} milestones={MILESTONES.map((m) => m.count)} glyph="coffee" columns={5} size={52} animateFrom={prev} />
        <div style={{ marginTop: 20 }}>
          <ProgressBar value={visits} max={nextMs.count} label={`Next: ${nextMs.label}`} />
        </div>
        <div style={{ font: 'var(--type-body-lg)', color: 'var(--text-strong)', marginTop: 12, fontWeight: 600 }}>
          {Math.max(0, nextMs.count - visits)} more {nextMs.count - visits === 1 ? 'visit' : 'visits'} to {nextMs.label.toLowerCase()}.
        </div>
      </Card>

      <div>
        <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Milestone ladder</div>
        <MilestoneLadder milestones={MILESTONES} current={visits} compact />
      </div>
    </div>
  );

  const RewardsTab = (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ font: 'var(--type-title)', fontSize: 36, letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>Your rewards</div>
      {unlocked.length === 0 ? (
        <EmptyState icon="gift" title="Nothing unlocked yet" body="Your first reward lands at 5 visits." />
      ) : unlocked.map((m) => (
        <RewardCard key={m.count} title={m.label}
          detail={redeemed.includes(m.label) ? 'Redeemed at the counter' : `Unlocked at visit ${m.count}`}
          state={redeemed.includes(m.label) ? 'redeemed' : 'unlocked'}
          onRedeem={() => openPin(m.label)} />
      ))}
      <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
        Redeeming always needs the café's PIN. Hand the phone over at the counter.
      </div>
    </div>
  );

  const HistoryTab = (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ font: 'var(--type-title)', fontSize: 36, letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>History</div>
      {[
        { d: 'Today', t: 'Visit marked', i: 'stamp', c: 'var(--grape-100)' },
        { d: '2 Sep', t: 'Free coffee redeemed', i: 'gift', c: 'var(--sun-100)' },
        { d: '2 Sep', t: 'Visit marked', i: 'stamp', c: 'var(--grape-100)' },
        { d: '28 Aug', t: 'Visit marked', i: 'stamp', c: 'var(--grape-100)' },
        { d: '21 Aug', t: 'Joined with 2 free stamps', i: 'sparkles', c: 'var(--mint-100)' },
      ].map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px',
          background: 'var(--paper-000)', border: 'var(--border-hair)', borderRadius: 'var(--radius-md)',
        }}>
          <span style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', background: r.c, border: 'var(--border-hair)', borderRadius: '50%' }}>
            <Icon name={r.i} size={18} />
          </span>
          <span style={{ flex: 1, font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{r.t}</span>
          <span style={{ font: 'var(--type-mono)', color: 'var(--text-muted)' }}>{r.d}</span>
        </div>
      ))}
    </div>
  );

  const body = screen === 'lookup' ? Lookup
    : screen === 'signup' ? Signup
    : tab === 'card' ? CardTab : tab === 'rewards' ? RewardsTab : HistoryTab;

  return (
    <div style={{
      position: 'relative', width: 420, height: 860, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-page)',
      border: 'var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--pop-3)',
    }}>
      <TopBar title="Kaapi House" subtitle="Indiranagar · Bengaluru" logo={Logo}
        right={screen !== 'lookup' ? <Badge tone="neutral" size="sm">{visits} visits</Badge> : null} />

      <div style={{ flex: 1, overflowY: 'auto' }}>{body}</div>

      {screen === 'card' && tab === 'card' ? (
        <div style={{ padding: '14px 20px 16px', borderTop: 'var(--border)', background: 'var(--paper-000)' }}>
          <Button size="lg" fullWidth icon="hand" onClick={() => openPin('visit')}>Mark my visit</Button>
        </div>
      ) : null}

      {screen === 'card' ? (
        <BottomBar value={tab} onChange={setTab} items={[
          { value: 'card', label: 'Card', icon: 'stamp' },
          { value: 'rewards', label: 'Rewards', icon: 'gift' },
          { value: 'history', label: 'History', icon: 'history' },
        ]} />
      ) : null}

      {toast ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, display: 'grid', placeItems: 'center', zIndex: 30 }}>
          <Toast tone="success">{toast}</Toast>
        </div>
      ) : null}

      <Dialog open={pinOpen} title="" onClose={() => setPinOpen(false)} width={380}>
        <PinPad value={pin} onChange={(v) => { setPin(v); setPinError(''); }} onComplete={completePin} error={pinError}
          subtitle={pinMode === 'visit' ? 'Staff confirms your visit. PIN is 4821.' : 'Staff confirms the reward. PIN is 4821.'} />
      </Dialog>

      <Celebration open={!!celebrate} title={celebrate ? `${celebrate.label} unlocked!` : ''}
        subtitle="Show this to the counter whenever you like."
        onDismiss={() => { setCelebrate(null); setTab('rewards'); }} />
    </div>
  );
}
