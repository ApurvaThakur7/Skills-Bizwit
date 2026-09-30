import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, tween} from '../lib/anim';
import {Avatar, Caret, DropChars, Paper, Pointer, card, typed} from '../lib/kit';

// F · 354–480 (local 0–126; ref 11.8–16.0) · "make it yours." editor → ours: live voice-agent call.
// ref: 0–8 editor card zooms in from blurred/large, centred; 10–15 second line gets a selection highlight,
// 15 deleted; headline types per char 15–33 while card slides to the left slot (15–33);
// new line retypes 27–51; right "POST RATING" card slides in 51, bars fill 54–70; green
// "✓ Ready to post" pill pops 96 with sparkles; cursor 100→111 onto Schedule, click 113, button turns green 117.
const CALLER = 'Hi, do you have a slot for a site visit this week?';
const DRAFT = 'Please hold while I check with the team.';
const REPLY = 'Yes! Thursday 11:00 is open. Shall I book it and confirm on WhatsApp?';
const FLOW = ['Call answered', 'Intent detected', 'Lead qualified', 'Slot offered', 'CRM updated'];

export const ShotF: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const zin = tween(f, [0, 9], [0, 1], EASE.out);
	const slide = tween(f, [15, 33], [0, 1], EASE.inOut);
	// card geometry: centred → left slot
	const W = 1000;
	const x = interpolate(slide, [0, 1], [(1920 - W) / 2, 150]);
	const y = interpolate(slide, [0, 1], [300, 290]);
	const sel = tween(f, [9, 13], [0, 1]);
	const deleted = f >= 16;
	const flowIn = tween(f, [51, 60], [0, 1], EASE.out);
	const pill = interpolate(f, [96, 100, 104], [0, 1.12, 1], clamp);
	const click = tween(f, [112, 117], [0, 1]);
	const booked = f >= 117;
	const btnX = x + W - 300;
	const btnY = y + 432;
	return (
		<AbsoluteFill>
			<Paper />
			{/* headline */}
			<DropChars segs={[{t: 'agents that '}, {t: 'never sleep.', accent: true}]} start={15} cps={1.1} size={86} style={{position: 'absolute', left: 150, top: 120}} />

			{/* editor / call card */}
			<div
				style={{
					...card,
					position: 'absolute',
					left: x,
					top: y,
					width: W,
					height: 500,
					padding: '30px 36px',
					transform: `scale(${interpolate(zin, [0, 1], [1.45, 1])})`,
					filter: zin < 1 ? `blur(${(1 - zin) * 14}px)` : undefined,
					opacity: 0.3 + zin * 0.7,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'flex-end', fontFamily: F.body, fontWeight: 600, fontSize: 17, color: '#8A93A3'}}>
					<span style={{marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 10, color: C.ok}}>
						<span style={{width: 10, height: 10, borderRadius: '50%', background: C.ok, opacity: Math.floor(f / 10) % 2 ? 0.4 : 1}} /> Live call
					</span>
					<span>☎ Phone</span>
					<span>◎ WhatsApp</span>
					<span>⌘ Website</span>
				</div>
				<div style={{display: 'flex', gap: 18, marginTop: 26}}>
					<Avatar size={46} bg="#E9EDF3" label="C" />
					<div style={{fontFamily: F.body, fontWeight: 500, fontSize: 25, color: '#6B7483', lineHeight: 1.45, paddingTop: 6}}>{CALLER}</div>
				</div>
				<div style={{display: 'flex', gap: 18, marginTop: 22}}>
					<Avatar size={46} bg={C.accent} label="AI" />
					<div style={{fontFamily: F.body, fontWeight: 600, fontSize: 27, color: C.ink, lineHeight: 1.45, paddingTop: 5, maxWidth: 820}}>
						{!deleted ? (
							<span style={{background: `rgba(0,128,255,${0.16 * sel})`, borderRadius: 4}}>{DRAFT}</span>
						) : (
							<>
								{typed(REPLY, f, 27, 2.9)}
								{f < 60 && <Caret h={28} />}
							</>
						)}
					</div>
				</div>
				{/* bottom row */}
				<div style={{position: 'absolute', left: 36, right: 36, bottom: 28, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.body, fontWeight: 600, fontSize: 18}}>
					<span style={{color: '#A3ABB8'}}>▢ ☺</span>
					<span style={{marginLeft: 'auto', color: '#8A93A3'}}>Transcript</span>
					<span style={{color: '#8A93A3', marginRight: 6}}>Notes</span>
					<span
						style={{
							padding: '11px 22px',
							borderRadius: 999,
							color: '#fff',
							background: booked ? C.ok : '#2A3140',
							transform: `scale(${1 - Math.sin(click * Math.PI) * 0.1})`,
							display: 'inline-block',
							minWidth: 150,
							textAlign: 'center',
						}}
					>
						{booked ? '✓ Thu 11:00' : '▦ Book slot'}
					</span>
					<span style={{padding: '11px 22px', borderRadius: 999, color: '#fff', background: C.ink}}>Transfer</span>
				</div>
			</div>

			{/* call-flow card (ref "POST RATING") */}
			{flowIn > 0 && (
				<div
					style={{
						...card,
						position: 'absolute',
						left: 1210 + (1 - flowIn) * 80,
						top: 290,
						width: 560,
						padding: '26px 30px',
						opacity: flowIn,
						filter: flowIn < 1 ? `blur(${(1 - flowIn) * 8}px)` : undefined,
					}}
				>
					<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 14, letterSpacing: '0.24em', color: '#8A93A3'}}>CALL FLOW</div>
					{FLOW.map((l, i) => {
						const p = tween(f, [55 + i * 3, 66 + i * 3], [0, 1], EASE.out);
						return (
							<div key={l} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
								<div style={{width: 170, fontFamily: F.body, fontWeight: 600, fontSize: 18, color: '#5B6474'}}>{l}</div>
								<div style={{flex: 1, height: 10, borderRadius: 5, background: '#EEF1F5', overflow: 'hidden'}}>
									<div style={{width: `${p * 100}%`, height: '100%', borderRadius: 5, background: C.ok}} />
								</div>
								<div style={{width: 24, fontFamily: F.body, fontWeight: 800, fontSize: 18, color: C.ok, opacity: p > 0.95 ? 1 : 0}}>✓</div>
							</div>
						);
					})}
				</div>
			)}

			{/* pill with sparkles */}
			{f >= 96 && (
				<div style={{position: 'absolute', left: 1150, top: 250, transform: `scale(${pill}) rotate(-4deg)`}}>
					<div style={{padding: '12px 22px', borderRadius: 999, background: C.ok, color: '#fff', fontFamily: F.body, fontWeight: 800, fontSize: 22, boxShadow: '0 10px 30px -8px rgba(34,181,115,0.6)'}}>✓ Lead qualified · 24/7</div>
					<svg width="260" height="120" viewBox="0 0 260 120" style={{position: 'absolute', left: -20, top: -40, overflow: 'visible'}}>
						{Array.from({length: 8}, (_, i) => {
							const a = (i / 8) * Math.PI * 2;
							const r = 60 + (f - 96) * 5;
							return <circle key={i} cx={140 + Math.cos(a) * r * 1.4} cy={60 + Math.sin(a) * r * 0.6} r={3} fill={i % 2 ? C.ok : C.ink} opacity={tween(f, [96, 110], [1, 0])} />;
						})}
					</svg>
				</div>
			)}

			{/* cursor → Book slot */}
			{f >= 98 && (
				<Pointer
					x={interpolate(f, [98, 111], [1600, btnX + 60], {...clamp, easing: EASE.inOut})}
					y={interpolate(f, [98, 111], [1000, btnY + 20], {...clamp, easing: EASE.inOut})}
					press={Math.sin(click * Math.PI)}
				/>
			)}
		</AbsoluteFill>
	);
};
