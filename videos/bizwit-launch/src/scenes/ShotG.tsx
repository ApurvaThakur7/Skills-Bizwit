import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, hash, tween} from '../lib/anim';
import {DropChars, Paper, card, typed} from '../lib/kit';

// G · 480–588 (local 0–108; ref 16.0–19.6) · "your week, handled." → ours "your busywork, handled."
// ref: 0–8 previous UI fades, soft accent blob; headline types 12–27; 4 day columns rise staggered 12–21,
// rows fill 21–40; extra row types into column 4 at 57–70; 90–99 whole board blurs + shrinks away;
// 99–108 month grid appears small, tilted, with accent blocks, and grows.
const DAYS: {d: string; n: string; rows: [string, string][]}[] = [
	{d: 'MON', n: '06', rows: [['09:00', 'Payment reminders sent'], ['10:30', 'New leads followed up'], ['14:00', 'Invoices reconciled'], ['18:00', 'Team hours logged']]},
	{d: 'TUE', n: '07', rows: [['08:00', 'Social posts published'], ['11:15', 'Demo calls booked'], ['16:40', 'Weekly report generated'], ['19:00', 'Reviews answered']]},
	{d: 'WED', n: '08', rows: [['09:30', 'WhatsApp queries answered'], ['12:00', 'Expenses categorised'], ['15:20', 'Stock levels synced'], ['17:45', 'Leads scored in CRM']]},
	{d: 'THU', n: '09', rows: [['08:00', 'Outreach emails sent'], ['10:00', 'Content calendar drafted'], ['13:30', 'Payroll prep ready'], ['16:00', 'Client check-ins booked']]},
];

const Column: React.FC<{i: number; hi?: boolean}> = ({i, hi}) => {
	const f = useCurrentFrame();
	const day = DAYS[i];
	const rise = tween(f, [3 + i * 3, 12 + i * 3], [0, 1], EASE.out);
	return (
		<div
			style={{
				...card,
				width: 385,
				height: 560,
				padding: '22px 24px',
				opacity: rise,
				transform: `translateY(${(1 - rise) * 120}px)`,
				background: hi ? 'linear-gradient(180deg, #F2F8FF 0%, #FFFFFF 40%)' : C.card,
				border: hi ? '1.5px solid rgba(0,128,255,0.35)' : card.border,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<div
					style={{
						width: 34,
						height: 34,
						borderRadius: '50%',
						background: i === 0 ? C.accent : 'transparent',
						color: i === 0 ? '#fff' : C.inkSoft,
						fontFamily: F.mono,
						fontWeight: 500,
						fontSize: 15,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{day.n}
				</div>
				<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 15, letterSpacing: '0.2em', color: '#8A93A3'}}>{day.d}</div>
				<div style={{marginLeft: 'auto', color: '#C2C8D1', fontSize: 18}}>⋯</div>
			</div>
			{day.rows.map(([t, txt], r) => {
				const t0 = 21 + i * 3 + r * 4 + (i === 3 && r === 3 ? 34 : 0);
				const p = tween(f, [t0, t0 + 6], [0, 1], EASE.out);
				const shown = i === 3 && r === 3 ? typed(txt, f, t0, 1.4) : txt;
				return (
					<div key={r} style={{marginTop: 26, opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 17, color: C.ink}}>{t}</div>
							<div style={{marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', border: `2px solid ${hi ? C.accent : '#22B573'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: hi ? C.accent : '#22B573', fontWeight: 800}}>✓</div>
						</div>
						<div style={{fontFamily: F.body, fontWeight: 600, fontSize: 20, color: '#3E4654', marginTop: 6, minHeight: 26}}>{shown}</div>
					</div>
				);
			})}
		</div>
	);
};

export const MonthGrid: React.FC<{p: number}> = ({p}) => (
	<div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 74px)', gap: 12}}>
		{Array.from({length: 35}, (_, k) => {
			const on = hash(k * 3.3) > 0.45;
			const two = hash(k * 7.1) > 0.7;
			return (
				<div key={k} style={{height: 96, borderRadius: 8, background: '#fff', boxShadow: '0 4px 12px -4px rgba(15,22,36,0.18)', padding: 8, opacity: interpolate(p, [0, 1], [0, 1])}}>
					<div style={{fontFamily: F.mono, fontSize: 11, color: '#9AA3B1'}}>{(k % 31) + 1}</div>
					{on && <div style={{height: 14, borderRadius: 4, background: C.accent, marginTop: 8}} />}
					{two && <div style={{height: 14, borderRadius: 4, background: C.accent2, marginTop: 6, width: '70%'}} />}
				</div>
			);
		})}
	</div>
);

export const ShotG: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const away = tween(f, [88, 99], [0, 1], EASE.in);
	const grid = tween(f, [98, 108], [0, 1], EASE.out);
	return (
		<AbsoluteFill>
			<Paper />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 78% 30%, rgba(0,128,255,0.12), rgba(0,128,255,0) 25%)', opacity: tween(f, [0, 8], [1, 0])}} />
			{f < 99 && (
				<AbsoluteFill style={{transform: `scale(${1 - away * 0.75}) translateY(${away * 60}px)`, filter: away > 0 ? `blur(${away * 12}px)` : undefined, opacity: 1 - away * 0.4}}>
					<DropChars segs={[{t: 'your busywork, '}, {t: 'handled.', accent: true}]} start={12} cps={1.0} size={86} style={{position: 'absolute', left: 150, top: 120}} />
					<div style={{position: 'absolute', left: 150, top: 290, display: 'flex', gap: 22}}>
						{[0, 1, 2, 3].map((i) => (
							<Column key={i} i={i} hi={i === 3} />
						))}
					</div>
				</AbsoluteFill>
			)}
			{f >= 98 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 1600}}>
					<div style={{transform: `rotateX(${interpolate(grid, [0, 1], [38, 10])}deg) rotateZ(${interpolate(grid, [0, 1], [-18, -4])}deg) scale(${interpolate(grid, [0, 1], [0.35, 1.25])})`}}>
						<MonthGrid p={grid} />
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// H · 588–606 (local 0–18; ref 19.6–20.2) · background drops to dark, grid spins & shrinks to a point (0–8),
// tiny glowing dot (8–12), then accent flash with radial speed lines (12–18) that bleeds into shot I.
export const ShotH: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const away = tween(f, [0, 8], [0, 1], EASE.in);
	const flash = tween(f, [12, 14], [0, 1]);
	return (
		<AbsoluteFill style={{background: C.space}}>
			{f < 9 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', perspective: 1600}}>
					<div style={{transform: `rotateX(${10 + away * 30}deg) rotateZ(${-4 + away * 150}deg) scale(${1.25 * (1 - away * 0.97)})`, filter: `blur(${away * 4}px)`}}>
						<MonthGrid p={1} />
					</div>
				</AbsoluteFill>
			)}
			{f >= 7 && f < 13 && (
				<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
					<circle cx={960} cy={540} r={5} fill={C.accent2} />
					<circle cx={960} cy={540} r={18} fill={C.accent} opacity={0.3} />
				</svg>
			)}
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, #3AA0FF 0%, ${C.accent} 45%, #0058C4 100%)`, opacity: flash}} />
			{f >= 12 && (
				<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
					{Array.from({length: 44}, (_, i) => {
						const a = (i / 44) * Math.PI * 2 + hash(i) * 0.1;
						const t = (f - 12 + hash(i * 3) * 4) / 8;
						const r0 = 60 + t * 800;
						const l = 140 + hash(i) * 280;
						return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * (r0 + l)} y2={540 + Math.sin(a) * (r0 + l)} stroke="#CFE6FF" strokeWidth={2 + hash(i) * 3} opacity={0.85 * (1 - Math.min(1, t))} />;
					})}
				</svg>
			)}
		</AbsoluteFill>
	);
};
