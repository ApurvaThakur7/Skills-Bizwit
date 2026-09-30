import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, tween} from '../lib/anim';
import {Paper, Skel, Smear, card} from '../lib/kit';

// D · 186–249 (local 0–63) · app console, pages flip fast.
// ref: 0–3 residual logo smear, sidebar appears 3–8 (items fade in top→bottom), page 1 "Studio" 15–30,
// page 2 "Calendar" 33–42, page 3 "Inspiration" 45–55 — each: title slides in from right with blur,
// cards stagger-fade; 57–63 whole view smears/fades out.
const NAV = ['Overview', 'AI Calling', 'Lead Generation', 'Workflows', 'Creatives', 'Insights', 'HR & Hiring', 'Finance'];
const PAGES = [
	{t0: 13, title: 'AI Calling', sub: 'Answer calls, qualify leads and book appointments, 24/7.', nav: 1, kind: 'voice'},
	{t0: 31, title: 'Workflows', sub: 'Multi-step processes running across your tools and platforms.', nav: 3, kind: 'shot'},
	{t0: 43, title: 'Insights', sub: 'Make smarter decisions with live data insights.', nav: 5, kind: 'insight'},
] as const;

const PageBody: React.FC<{kind: string; t0: number}> = ({kind, t0}) => {
	const f = useCurrentFrame();
	const st = (i: number) => {
		const p = tween(f, [t0 + 2 + i * 2, t0 + 8 + i * 2], [0, 1], EASE.out);
		return {opacity: p, transform: `translateY(${(1 - p) * 24}px)`};
	};
	if (kind === 'shot') {
		// real bizwitai.com services grid, framed as a dark panel inside the light app
		return (
			<div style={{display: 'flex', gap: 26, marginTop: 40}}>
				<div style={{...card, ...st(0), width: 900, height: 470, overflow: 'hidden', background: '#000', padding: 0}}>
					<Img src={staticFile('assets/01.png')} style={{width: 900, marginTop: -150}} />
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{...card, ...st(i + 1), width: 380, height: 143, padding: 24}}>
							<Skel w={150} h={12} />
							<Skel w={300} h={9} style={{marginTop: 18}} />
							<Skel w={240} h={9} style={{marginTop: 10}} />
						</div>
					))}
				</div>
			</div>
		);
	}
	const labels = kind === 'voice' ? ['Inbound calls', 'WhatsApp', 'Website chat'] : ['Sales', 'Support', 'Operations'];
	return (
		<div style={{display: 'flex', gap: 26, marginTop: 40}}>
			<div style={{...card, ...st(0), width: 900, height: 470, padding: 34, position: 'relative'}}>
				<Skel w={220} h={13} />
				<Skel w={560} h={10} style={{marginTop: 22}} />
				<Skel w={480} h={10} style={{marginTop: 12}} />
				<div style={{display: 'flex', gap: 14, marginTop: 40}}>
					{labels.map((l) => (
						<div key={l} style={{padding: '10px 18px', borderRadius: 999, border: `1px solid ${C.line}`, fontFamily: F.body, fontWeight: 600, fontSize: 18, color: C.inkSoft}}>
							{l}
						</div>
					))}
				</div>
				<div style={{position: 'absolute', right: 30, bottom: 30, width: 130, height: 40, borderRadius: 999, background: C.ink}} />
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{...card, ...st(i + 1), width: 380, height: 143, padding: 24}}>
						<Skel w={130} h={12} c={i === 0 ? 'rgba(0,128,255,0.35)' : undefined} />
						<Skel w={300} h={9} style={{marginTop: 18}} />
						<Skel w={220} h={9} style={{marginTop: 10}} />
					</div>
				))}
			</div>
		</div>
	);
};

export const ShotD: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const out = tween(f, [dur - 7, dur], [0, 1], EASE.in);
	const page = [...PAGES].reverse().find((p) => f >= p.t0);
	const sideIn = tween(f, [0, 6], [0, 1], EASE.out);
	return (
		<AbsoluteFill>
			<Paper />
			<Smear dx={out * 500} n={out > 0 ? 7 : 1} style={{opacity: 1 - out * 0.85}}>
				{/* sidebar */}
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 290, borderRight: `1px solid ${C.line}`, background: 'rgba(255,255,255,0.55)', padding: '46px 34px', opacity: sideIn}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40}}>
						<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: C.ink}}>Bizwit AI</div>
					</div>
					{NAV.map((n, i) => {
						const on = page && page.nav === i;
						const p = tween(f, [3 + i * 0.8, 8 + i * 0.8], [0, 1]);
						return (
							<div
								key={n}
								style={{
									opacity: p,
									display: 'flex',
									alignItems: 'center',
									gap: 14,
									padding: '11px 14px',
									marginBottom: 6,
									borderRadius: 10,
									background: on ? 'rgba(0,128,255,0.1)' : 'transparent',
									fontFamily: F.body,
									fontWeight: 600,
									fontSize: 19,
									color: on ? C.accent : C.inkSoft,
								}}
							>
								<div style={{width: 16, height: 16, borderRadius: 5, border: `2px solid ${on ? C.accent : '#A6AFBD'}`}} />
								{n}
							</div>
						);
					})}
				</div>
				{/* page */}
				{page && (
					<div key={page.title} style={{position: 'absolute', left: 350, top: 70}}>
						{(() => {
							const p = tween(f, [page.t0, page.t0 + 5], [0, 1], EASE.out);
							return (
								<div style={{transform: `translateX(${(1 - p) * 90}px)`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, opacity: p}}>
									<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, letterSpacing: '-0.045em', color: C.ink}}>{page.title}</div>
									<div style={{fontFamily: F.body, fontWeight: 500, fontSize: 21, color: C.inkSoft, marginTop: 8}}>{page.sub}</div>
								</div>
							);
						})()}
						<PageBody kind={page.kind} t0={page.t0} />
					</div>
				)}
			</Smear>
		</AbsoluteFill>
	);
};
