import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, tween} from '../lib/anim';
import {Avatar, Paper, Pointer, card} from '../lib/kit';

// E · 249–381 (local 0–132) · huge numeral counts up + 3D card stack.
// ref: numeral rolls 1→10 one step per ~3 f with vertical blur (0–33); "ready posts" types per char 6–18;
// "every day," 24, "in your voice." 29; tiny orange mono label above.
// Right: white cards whoosh in rotated in 3D (33–42), front card settles & swaps content every ~9 f (42–70),
// stack grows behind fanned up-left (70–100), cursor enters 85, clicks "Edit in Studio" at 100;
// (retimed: click 84–90, exit 93–105) front card zooms toward centre with blur (hand-off to the editor shot).
// ours: 1→24 then "/7" slams; "automation" / "every day, on autopilot."; stack = the 8 Bizwit services.
const SERVICES = [
	['Automated Workflows', 'Multi-step processes across your tools and platforms, running on their own.'],
	['AI Voice Agents', '24/7 human-like voice agents that answer calls, qualify leads, book appointments.'],
	['AI Agents', 'Sales & marketing agents for leads, content, social posts and email outreach.'],
	['Real-Time Intelligence', 'Make smarter decisions with live data insights.'],
	['AI Filmmaking', 'Cinematic AI videos for brands: AI ads, UGC and music videos.'],
	['AI Strategy Consulting', 'Expert guidance to implement AI for growth.'],
	['Custom AI Solutions', 'Tailor-made AI systems designed around your exact use case. No templates. No generic tools.'],
];

const ServiceCard: React.FC<{title: string; body: string; press?: number; w?: number}> = ({title, body, press = 0, w = 640}) => (
	<div style={{...card, width: w, padding: '26px 30px 22px'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
			<Avatar size={40} bg={C.ink} label="B" />
			<div style={{fontFamily: F.body, fontWeight: 700, fontSize: 19, color: C.ink}}>
				Bizwit AI <span style={{fontWeight: 500, color: '#98A1B0'}}>· service</span>
			</div>
			<div style={{marginLeft: 'auto', fontFamily: F.mono, fontSize: 13, color: '#A3ABB8', letterSpacing: '0.1em'}}>BIZWITAI.COM</div>
		</div>
		<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30, letterSpacing: '-0.035em', color: C.ink, marginTop: 18}}>{title}</div>
		<div style={{fontFamily: F.body, fontWeight: 500, fontSize: 19, lineHeight: 1.4, color: '#4A5361', marginTop: 8, minHeight: 54}}>{body}</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, borderTop: `1px solid ${C.line}`, paddingTop: 16}}>
			<div style={{fontFamily: F.body, fontWeight: 600, fontSize: 16, color: C.accent}}>✦ Built with AI</div>
			<div style={{marginLeft: 'auto', fontFamily: F.body, fontWeight: 600, fontSize: 16, color: C.inkSoft, padding: '8px 14px'}}>View services</div>
			<div
				style={{
					fontFamily: F.body,
					fontWeight: 700,
					fontSize: 16,
					color: '#fff',
					background: press > 0.5 ? '#0066CC' : C.accent,
					padding: '9px 18px',
					borderRadius: 999,
					transform: `scale(${1 - Math.sin(Math.min(1, press) * Math.PI) * 0.08})`,
				}}
			>
				Get in touch →
			</div>
		</div>
	</div>
);

export const ShotE: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	// --- numeral ---
	const steps = 24;
	const countEnd = 34;
	const prog = interpolate(f, [0, countEnd], [0, 1], {...clamp, easing: EASE.inOut});
	const n = Math.max(1, Math.round(1 + prog * (steps - 1)));
	const stepPhase = (prog * (steps - 1)) % 1;
	const rolling = f < countEnd;
	const slash = tween(f, [countEnd + 1, countEnd + 6], [0, 1], EASE.out);
	// --- right stack ---
	const swapEvery = 6;
	const settle = 40;
	const idx = Math.min(SERVICES.length - 1, Math.max(0, Math.floor((f - settle) / swapEvery)));
	const zoom = tween(f, [dur - 12, dur], [0, 1], EASE.in);
	const press = tween(f, [84, 90], [0, 1]);
	const cardX = 1060;
	const cardY = 300;
	return (
		<AbsoluteFill>
			<Paper />
			{/* left block */}
			<div style={{position: 'absolute', left: 130, top: 196, opacity: 1 - zoom, filter: zoom > 0 ? `blur(${zoom * 8}px)` : undefined}}>
				<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 16, letterSpacing: '0.32em', color: C.accent, opacity: tween(f, [2, 6], [0, 1])}}>ALWAYS ON</div>
				<div style={{display: 'flex', alignItems: 'baseline', fontFamily: F.display, fontWeight: 800, fontSize: 300, letterSpacing: '-0.07em', lineHeight: 0.92, color: C.ink, marginTop: 8}}>
					<span style={{display: 'inline-block', filter: rolling && stepPhase > 0.15 ? `blur(${3 + stepPhase * 4}px)` : undefined, transform: rolling ? `translateY(${-stepPhase * 18}px)` : undefined}}>{n}</span>
					<span style={{display: 'inline-block', color: C.accent, opacity: slash, transform: `scale(${interpolate(slash, [0, 1], [1.6, 1])})`, filter: slash < 1 ? `blur(${(1 - slash) * 14}px)` : undefined, transformOrigin: '0 70%'}}>
						/7
					</span>
				</div>
				<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.05em', color: C.ink, marginTop: 6, whiteSpace: 'pre'}}>
					{'automation'.split('').map((ch, i) => {
						const p = tween(f, [6 + i * 1.3, 11 + i * 1.3], [0, 1], EASE.out);
						return (
							<span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined}}>
								{ch}
							</span>
						);
					})}
				</div>
				<div style={{fontFamily: F.display, fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em', marginTop: 18}}>
					<span style={{color: C.inkSoft, opacity: tween(f, [24, 30], [0, 1])}}>every day, </span>
					<span style={{color: C.accent, opacity: tween(f, [29, 35], [0, 1])}}>on autopilot.</span>
				</div>
			</div>

			{/* 3D stack */}
			<div style={{position: 'absolute', left: cardX, top: cardY, perspective: 1400}}>
				{/* fanned cards behind (grow over 70–100) */}
				{Array.from({length: 7}, (_, i) => {
					const k = 7 - i;
					const p = tween(f, [58 + i * 2.5, 66 + i * 2.5], [0, 1], EASE.out);
					if (p <= 0) return null;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: 0,
								top: 0,
								opacity: p * (0.35 + 0.08 * (7 - k)) * (1 - zoom),
								transform: `translate(${-k * 10 * p}px, ${-k * 16 * p}px) scale(${1 - k * 0.012})`,
								transformOrigin: '0 0',
							}}
						>
							<ServiceCard {...{title: SERVICES[i][0], body: SERVICES[i][1]}} />
						</div>
					);
				})}
				{/* whoosh-in blanks 30–42 */}
				{f >= 30 &&
					f < 44 &&
					[0, 1, 2].map((i) => {
						const p = tween(f, [30 + i * 2, 40 + i * 2], [0, 1], EASE.out);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: 0,
									top: 0,
									width: 640,
									height: 250,
									...card,
									opacity: (1 - p) * 0.9,
									transform: `translate(${(1 - p) * 500 + i * 30}px, ${(1 - p) * 300}px) rotateY(${-40 * (1 - p)}deg) rotateZ(${-10 * (1 - p)}deg)`,
									filter: `blur(${(1 - p) * 10}px)`,
								}}
							/>
						);
					})}
				{/* front card */}
				{f >= 34 &&
					(() => {
						const p = tween(f, [34, 44], [0, 1], EASE.out);
						const swapP = f >= settle ? tween(f, [settle + idx * swapEvery, settle + idx * swapEvery + 4], [0, 1], EASE.out) : 1;
						return (
							<div
								style={{
									position: 'absolute',
									left: 0,
									top: 0,
									transformOrigin: '50% 50%',
									transform: `translate(${(1 - p) * 260 + zoom * -520}px, ${(1 - p) * 120 + zoom * 120}px) rotateY(${-32 * (1 - p)}deg) rotateX(${8 * (1 - p)}deg) scale(${1 + zoom * 1.1})`,
									filter: zoom > 0 ? `blur(${zoom * 10}px)` : undefined,
									opacity: p,
								}}
							>
								<div style={{transform: `translateY(${(1 - swapP) * 26}px)`, opacity: 0.4 + swapP * 0.6}}>
									<ServiceCard title={SERVICES[idx][0]} body={SERVICES[idx][1]} press={press} />
								</div>
							</div>
						);
					})()}
			</div>

			{/* cursor → Get in touch */}
			{f >= 68 && f < dur - 8 && (
				<Pointer
					x={interpolate(f, [68, 83], [1500, cardX + 560], {...clamp, easing: EASE.inOut})}
					y={interpolate(f, [68, 83], [900, cardY + 262], {...clamp, easing: EASE.inOut})}
					press={Math.sin(press * Math.PI)}
				/>
			)}
		</AbsoluteFill>
	);
};
