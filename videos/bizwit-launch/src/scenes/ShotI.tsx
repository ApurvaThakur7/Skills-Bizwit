import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, hash, tween} from '../lib/anim';
import {Avatar, Caret, Orb, Space, darkCard, typed} from '../lib/kit';

// I · 606–705 (local 0–99; ref 20.2–23.5) · dark, "build connections, not impressions." → ours
// "what should we / automate first?"
// ref: 0–6 accent flash decays to dark (speed lines), line 1 slams with blur 0–5, line 2 horizontal-blur slam 5–12;
// hold centred to 39; 39–52 headline shrinks & moves to top, card fades up (blurred) 45–54;
// reply types 54–80, green "Sent" 80; pills pop left 82 / 91 and right 96.
const ROWS = [
	['Lead captured', 'website chat', C.accent2],
	['Invoice paid', 'payments', '#22B573'],
	['Call booked', 'voice agent', C.accent2],
] as const;

export const ShotI: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const fade = tween(f, [0, 7], [1, 0]);
	const l1 = tween(f, [0, 5], [0, 1], EASE.out);
	const l2 = tween(f, [5, 12], [0, 1], EASE.out);
	const up = tween(f, [22, 33], [0, 1], EASE.inOut);
	const cardIn = tween(f, [27, 37], [0, 1], EASE.out);
	const pill = (t: number) => interpolate(f, [t, t + 4, t + 7], [0, 1.1, 1], clamp);
	const Pill: React.FC<{t: number; x: number; y: number; txt: string; dot: string}> = ({t, x, y, txt, dot}) =>
		f >= t ? (
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					transform: `translate(-50%,-50%) scale(${pill(t)})`,
					padding: '12px 22px',
					borderRadius: 999,
					background: '#fff',
					color: C.ink,
					fontFamily: F.body,
					fontWeight: 700,
					fontSize: 19,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					boxShadow: `0 0 0 4px rgba(0,128,255,0.25), 0 16px 40px -10px rgba(0,0,0,0.6)`,
					whiteSpace: 'nowrap',
				}}
			>
				<span style={{width: 12, height: 12, borderRadius: '50%', background: dot}} />
				{txt}
			</div>
		) : null;
	const size = interpolate(up, [0, 1], [104, 60]);
	return (
		<AbsoluteFill>
			<Space seed={9} />
			<Orb size={1300} strength={1.1} />
			{/* drifting embers */}
			<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
				{Array.from({length: 40}, (_, i) => (
					<circle key={i} cx={960 + (hash(i) - 0.5) * 700} cy={((hash(i * 2) * 700 + 250 - f * (0.6 + hash(i) * 1.2)) % 800) + 150} r={1.5 + hash(i * 5) * 2} fill={C.accent2} opacity={0.35 + hash(i * 7) * 0.5} />
				))}
				<circle cx={960} cy={540} r={330} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
			</svg>
			<AbsoluteFill style={{background: C.accent, opacity: fade}} />

			{/* headline */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: interpolate(up, [0, 1], [410, 88]),
					textAlign: 'center',
					fontFamily: F.display,
					fontWeight: 800,
					fontSize: size,
					letterSpacing: '-0.05em',
					lineHeight: 1.02,
				}}
			>
				<div style={{color: '#fff', opacity: l1, transform: `scale(${1.4 - l1 * 0.4})`, filter: l1 < 1 ? `blur(${(1 - l1) * 16}px)` : undefined}}>what should we</div>
				<div style={{color: C.accent2, opacity: l2, transform: `translateX(${(1 - l2) * -140}px) scaleX(${1 + (1 - l2) * 0.5})`, filter: l2 < 1 ? `blur(${(1 - l2) * 18}px)` : undefined}}>
					automate first?
				</div>
			</div>

			{/* live intelligence card */}
			{cardIn > 0 && (
				<div
					style={{
						...darkCard,
						position: 'absolute',
						left: 560,
						top: 330,
						width: 800,
						padding: '26px 30px',
						opacity: cardIn,
						transform: `translateY(${(1 - cardIn) * 40}px)`,
						filter: cardIn < 1 ? `blur(${(1 - cardIn) * 10}px)` : undefined,
					}}
				>
					<div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: 'rgba(0,128,255,0.14)', color: C.accent2, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.14em'}}>
						● LIVE · REAL-TIME INTELLIGENCE
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 20}}>
						<Avatar size={44} bg={C.accent} label="B" />
						<div>
							<div style={{fontFamily: F.body, fontWeight: 700, fontSize: 20, color: '#fff'}}>Bizwit ops agent</div>
							<div style={{fontFamily: F.body, fontWeight: 500, fontSize: 15, color: '#7E8898'}}>watching sales, support and operations</div>
						</div>
					</div>
					<div style={{fontFamily: F.body, fontWeight: 600, fontSize: 24, color: '#E8ECF3', marginTop: 18}}>Which leads should we follow up today?</div>
					<div style={{display: 'flex', gap: 10, marginTop: 14}}>
						{ROWS.map(([a, b, c], i) => {
							const p = tween(f, [38 + i * 4, 44 + i * 4], [0, 1], EASE.out);
							return (
								<div key={a} style={{flex: 1, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
									<div style={{fontFamily: F.body, fontWeight: 700, fontSize: 16, color: c}}>{a}</div>
									<div style={{fontFamily: F.mono, fontSize: 12, color: '#6E788A', marginTop: 3}}>{b}</div>
								</div>
							);
						})}
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)'}}>
						<Avatar size={28} bg="#2A3140" label="AI" />
						<div style={{fontFamily: F.body, fontWeight: 500, fontSize: 18, color: '#C9D1DD', flex: 1, minHeight: 24}}>
							{typed('Warm leads flagged. Follow-ups drafted and scheduled.', f, 42, 2.4)}
							{f < 64 && <Caret h={20} color={C.accent2} />}
						</div>
						<div style={{padding: '7px 16px', borderRadius: 8, background: f >= 64 ? '#22B573' : '#fff', color: f >= 64 ? '#fff' : C.ink, fontFamily: F.body, fontWeight: 700, fontSize: 15}}>{f >= 64 ? '✓ Sent' : 'Send'}</div>
					</div>
				</div>
			)}

			<Pill t={66} x={440} y={560} txt="new lead qualified" dot={C.accent2} />
			<Pill t={78} x={470} y={650} txt="payment received" dot="#22B573" />
			<Pill t={80} x={1500} y={560} txt="meeting booked" dot={C.accent2} />
		</AbsoluteFill>
	);
};

// J · 705–726 (local 0–21; ref 23.5–24.2) · everything streaks out, glowing line chart draws with a bright head.
const PTS: [number, number][] = [
	[40, 1000],
	[230, 930],
	[360, 960],
	[520, 860],
	[760, 760],
	[940, 800],
	[1160, 600],
	[1340, 660],
	[1560, 430],
	[1700, 300],
	[1790, 150],
];
export const ShotJ: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const p = tween(f, [0, 7], [0, 1], EASE.out);
	// polyline length param
	const segs = PTS.slice(1).map((pt, i) => Math.hypot(pt[0] - PTS[i][0], pt[1] - PTS[i][1]));
	const total = segs.reduce((a, b) => a + b, 0);
	let rem = p * total;
	let head = PTS[0];
	const drawn: [number, number][] = [PTS[0]];
	for (let i = 0; i < segs.length; i++) {
		if (rem >= segs[i]) {
			drawn.push(PTS[i + 1]);
			rem -= segs[i];
			head = PTS[i + 1];
		} else {
			const k = rem / segs[i];
			head = [PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * k, PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * k];
			drawn.push(head);
			break;
		}
	}
	const d = drawn.map((q, i) => `${i ? 'L' : 'M'}${q[0]},${q[1]}`).join(' ');
	return (
		<AbsoluteFill>
			<Space seed={5} />
			<Orb size={1100} strength={0.8} x={45} y={55} />
			{/* streak remnants of the previous UI */}
			{f < 5 &&
				[
					[440, 560],
					[470, 650],
					[1500, 560],
					[960, 480],
				].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x - 200 + f * (i === 2 ? 120 : -120), top: y, width: 400, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.6)', filter: 'blur(3px)', opacity: 1 - f / 5}} />)}
			<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
				<defs>
					<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="10" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<path d={d} fill="none" stroke={C.accent} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" opacity={0.55} filter="url(#glow)" />
				<path d={d} fill="none" stroke="#6FC0FF" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
				<circle cx={head[0]} cy={head[1]} r={26} fill={C.accent2} opacity={0.35} filter="url(#glow)" />
				<circle cx={head[0]} cy={head[1]} r={9} fill="#fff" />
				<text x={head[0] - 30} y={head[1] + 6} textAnchor="end" fill={C.accent2} fontFamily="JetBrains Mono" fontSize={17} letterSpacing="3" opacity={tween(f, [6, 9], [0, 1])}>
					GROW STRONGER
				</text>
			</svg>
		</AbsoluteFill>
	);
};
