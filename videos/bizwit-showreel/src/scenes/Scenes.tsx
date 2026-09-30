import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../brand';
import {EASE, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';
import {DotGrid, Glow} from '../components/Backgrounds';
import {CameraDrift, RingPulse} from '../components/FX';
import {ChromaWord, EmbossPanel, Emblem, Eyebrow, GlowLine, Headline, NeuralField, OrbBg} from '../components/Bizwit';

const center: React.CSSProperties = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

// 1 — black, neural lines converge, embossed emblem presses out.
export const S1Emblem: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = springAt(f, fps, 30, 'heavy');
	const pulse = tween(f, [44, 50], [0, 1]) * tween(f, [50, 70], [1, 0]);
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<OrbBg intensity={tween(f, [20, 50], [0.2, 1])} />
			<NeuralField start={0} dur={34} fade={tween(f, [46, 70], [1, 0.35])} />
			<CameraDrift dur={dur} zoom={[1.08, 1]}>
				<AbsoluteFill style={center}>
					<div style={{transform: `scale(${0.4 + 0.6 * s})`, opacity: tween(f, [30, 38], [0, 1])}}>
						<Emblem size={240} p={s} pulse={pulse} />
					</div>
				</AbsoluteFill>
			</CameraDrift>
			{f > 44 ? <RingPulse count={2} color={C.accent2} period={40} maxR={900} width={2} /> : null}
		</AbsoluteFill>
	);
};

// 2 — question slams in with chromatic blur.
export const S2Question: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const L1 = ['still', 'running', 'your'];
	const L2 = ['business'];
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<Glow color={C.accent3} size={1400} opacity={0.12} y={60} />
			<CameraDrift dur={dur} zoom={[1, 1.06]}>
				<AbsoluteFill style={{...center, flexDirection: 'column', gap: 10 * u}}>
					<div style={{display: 'flex', gap: 38 * u}}>
						{L1.map((w, i) => (
							<ChromaWord key={w} text={w} at={2 + i * 6} size={150} />
						))}
					</div>
					<div style={{display: 'flex', gap: 38 * u, alignItems: 'baseline'}}>
						{L2.map((w) => (
							<ChromaWord key={w} text={w} at={20} size={150} />
						))}
						<ChromaWord text="manually?" at={30} size={178} italic weight={400} font={F.serif} color={C.accent2} style={{textShadow: `0 0 ${50 * u}px rgba(0,157,255,0.5)`}} />
					</div>
				</AbsoluteFill>
			</CameraDrift>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 90 * u, ...center}}>
				<Eyebrow text="bizwitai / ai solutions" start={40} />
			</div>
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: tween(f, [30, 32], [0.18, 0]) * (f >= 30 ? 1 : 0)}} />
		</AbsoluteFill>
	);
};

// 3 — full-bleed blue slide, "meet bizwitai".
export const S3Meet: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const reveal = tween(f, [0, 12], [0, 100], EASE.inOut);
	const s = springAt(f, fps, 4, 'heavy');
	const sub = tween(f, [2, 14], [0, 1]);
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<AbsoluteFill style={{clipPath: `circle(${reveal * 1.2}% at 50% 50%)`, background: `radial-gradient(ellipse at 50% 40%, #2E9BFF 0%, ${C.accent} 45%, #0060E0 100%)`}}>
				<CameraDrift dur={dur} zoom={[1, 1.05]}>
					<AbsoluteFill style={{...center, flexDirection: 'column'}}>
						<div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 110 * u, color: 'rgba(255,255,255,0.92)', opacity: sub, transform: `translateY(${(1 - sub) * 30 * u}px)`, marginBottom: -20 * u}}>meet</div>
						<div
							style={{
								fontFamily: F.display,
								fontWeight: 800,
								fontSize: 290 * u,
								letterSpacing: '-0.06em',
								lineHeight: 1,
								color: '#fff',
								transform: `scale(${1.35 - 0.35 * s})`,
								filter: `blur(${(1 - s) * 16 * u}px)`,
								textShadow: `0 ${4 * u}px 0 rgba(0,40,120,0.45), 0 -${2 * u}px 0 rgba(255,255,255,0.35), 0 ${30 * u}px ${60 * u}px rgba(0,20,80,0.45)`,
							}}
						>
							bizwitai
						</div>
					</AbsoluteFill>
				</CameraDrift>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Check: React.FC<{at: number; size?: number}> = ({at, size = 44}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const s = springAt(f, fps, at, 'bouncy');
	return (
		<div style={{width: size * u, height: size * u, borderRadius: '50%', background: `linear-gradient(145deg, #3AA6FF, ${C.accent})`, boxShadow: `0 0 ${18 * u}px rgba(0,157,255,0.6), inset ${2 * u}px ${2 * u}px ${3 * u}px rgba(255,255,255,0.4)`, transform: `scale(${s})`, ...center, color: '#fff', fontFamily: F.display, fontWeight: 800, fontSize: size * 0.55 * u}}>
			✓
		</div>
	);
};

// 4 — workflow: embossed node cards in a 3D stack, wired together.
export const S4Workflow: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const nodes = [
		{tag: 'crm', title: 'new lead captured', meta: 'website form → crm', at: 14},
		{tag: 'payments', title: 'payment received', meta: 'invoice auto-matched', at: 26},
		{tag: 'whatsapp', title: 'follow-up sent', meta: 'personalised, right on time', at: 38},
	];
	const W = 640;
	const H = 150;
	const gap = 70;
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<OrbBg x={70} y={50} size={1200} intensity={0.8} />
			<DotGrid gap={44} opacity={0.08} />
			<CameraDrift dur={dur} zoom={[1.05, 1]} pan={[-20, 0]}>
				<div style={{position: 'absolute', left: 150 * u, top: 330 * u, width: 720 * u}}>
					<Eyebrow text="ai automation · live" start={4} />
					<Headline text="automate every workflow" em={['workflow']} start={6} size={112} style={{marginTop: 28 * u}} />
					<div style={{marginTop: 34 * u, fontFamily: F.body, fontWeight: 500, fontSize: 32 * u, color: C.dim, opacity: tween(f, [30, 46], [0, 1])}}>multi-step pipelines across your crm, payments and chat</div>
				</div>
				<div style={{position: 'absolute', left: 1020 * u, top: 190 * u, width: W * u, height: 700 * u, perspective: 1600 * u}}>
					<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${-16 + tween(f, [0, dur], [0, 6])}deg) rotateX(10deg)`}}>
						{/* connectors */}
						<svg width={W * u} height={700 * u} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							{[0, 1].map((k) => {
								const y1 = (k * (H + gap) + H) * u;
								const y2 = ((k + 1) * (H + gap)) * u;
								const p = tween(f, [nodes[k + 1].at - 6, nodes[k + 1].at + 6], [0, 1]);
								const dot = ((f - nodes[k + 1].at) / 24) % 1;
								return (
									<g key={k}>
										<line x1={90 * u} x2={90 * u} y1={y1} y2={y1 + (y2 - y1) * p} stroke={C.accent2} strokeWidth={3 * u} style={{filter: `drop-shadow(0 0 ${6 * u}px ${C.accent2})`}} />
										{p >= 1 ? <circle cx={90 * u} cy={y1 + (y2 - y1) * dot} r={6 * u} fill="#CFE8FF" style={{filter: `drop-shadow(0 0 ${8 * u}px ${C.accent2})`}} /> : null}
									</g>
								);
							})}
						</svg>
						{nodes.map((n, i) => {
							const s = springAt(f, fps, n.at, 'snappy');
							const y = i * (H + gap);
							return (
								<div key={n.tag} style={{position: 'absolute', left: 0, top: y * u, transform: `translateZ(${(1 - s) * -400 * u + i * 30 * u}px) translateY(${(1 - s) * 120 * u}px) rotateX(${(1 - s) * 40}deg)`, opacity: s}}>
									<EmbossPanel w={W} h={H} r={30} glow={i === 2 ? tween(f, [n.at + 20, n.at + 40], [0, 1]) : 0}>
										<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: `0 ${40 * u}px`, gap: 30 * u}}>
											<div style={{width: 100 * u, height: 100 * u, borderRadius: 26 * u, background: 'linear-gradient(145deg, #1B2233, #0A0D15)', boxShadow: `inset ${2 * u}px ${2 * u}px ${3 * u}px rgba(255,255,255,0.08), inset -${3 * u}px -${3 * u}px ${6 * u}px rgba(0,0,0,0.6)`, ...center, fontFamily: F.mono, fontSize: 18 * u, color: C.accent2, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
												{String(i + 1).padStart(2, '0')}
											</div>
											<div style={{flex: 1}}>
												<div style={{fontFamily: F.mono, fontSize: 18 * u, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent2}}>{n.tag}</div>
												<div style={{fontFamily: F.display, fontWeight: 700, fontSize: 40 * u, color: C.text, letterSpacing: '-0.02em', marginTop: 6 * u}}>{n.title}</div>
												<div style={{fontFamily: F.body, fontSize: 24 * u, color: C.dim, marginTop: 4 * u}}>{n.meta}</div>
											</div>
											<Check at={n.at + 14} />
										</div>
									</EmbossPanel>
								</div>
							);
						})}
					</div>
				</div>
			</CameraDrift>
		</AbsoluteFill>
	);
};

const Bubble: React.FC<{at: number; me?: boolean; children: React.ReactNode}> = ({at, me = false, children}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const s = springAt(f, fps, at, 'snappy');
	return (
		<div style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '82%', opacity: s, transform: `translateY(${(1 - s) * 30 * u}px) scale(${0.9 + 0.1 * s})`, transformOrigin: me ? 'right bottom' : 'left bottom'}}>
			<div
				style={{
					padding: `${20 * u}px ${26 * u}px`,
					borderRadius: 26 * u,
					borderBottomRightRadius: me ? 8 * u : 26 * u,
					borderBottomLeftRadius: me ? 26 * u : 8 * u,
					fontFamily: F.body,
					fontWeight: 500,
					fontSize: 28 * u,
					lineHeight: 1.3,
					color: me ? '#fff' : C.text,
					background: me ? `linear-gradient(145deg, #2E9BFF, ${C.accent})` : 'linear-gradient(145deg, #1A1F2D, #0E121B)',
					boxShadow: me
						? `inset ${2 * u}px ${2 * u}px ${3 * u}px rgba(255,255,255,0.35), 0 ${10 * u}px ${30 * u}px rgba(0,128,255,0.35)`
						: `inset ${2 * u}px ${2 * u}px ${2 * u}px rgba(255,255,255,0.07), inset -${2 * u}px -${2 * u}px ${4 * u}px rgba(0,0,0,0.5), 0 ${10 * u}px ${24 * u}px rgba(0,0,0,0.5)`,
				}}
			>
				{children}
			</div>
		</div>
	);
};

// 5 — AI agent chat card at 2 am.
export const S5Agents: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const panel = springAt(f, fps, 4, 'snappy');
	const typing = f > 40 && f < 56;
	const badge = springAt(f, fps, 92, 'bouncy');
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<OrbBg x={68} y={55} size={1200} intensity={0.8} />
			<DotGrid gap={44} opacity={0.08} />
			<CameraDrift dur={dur} zoom={[1.04, 1]}>
				<div style={{position: 'absolute', left: 150 * u, top: 330 * u, width: 700 * u}}>
					<Eyebrow text="ai chatbots & assistants" start={4} />
					<Headline text="ai agents that never sleep" em={['never', 'sleep']} start={6} size={112} style={{marginTop: 28 * u}} />
					<div style={{marginTop: 34 * u, fontFamily: F.body, fontWeight: 500, fontSize: 32 * u, color: C.dim, opacity: tween(f, [30, 46], [0, 1])}}>answer queries, qualify leads, book the next step</div>
				</div>
				<div style={{position: 'absolute', left: 1060 * u, top: 150 * u, opacity: panel, transform: `perspective(${1600 * u}px) rotateY(${-10 + (1 - panel) * -20}deg) translateY(${(1 - panel) * 80 * u}px)`}}>
					<EmbossPanel w={660} h={780} r={40} glow={0.5}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 110 * u, borderBottom: `${1 * u}px solid rgba(255,255,255,0.06)`, display: 'flex', alignItems: 'center', padding: `0 ${34 * u}px`, gap: 20 * u}}>
							<div style={{transform: `scale(${1})`}}>
								<Emblem size={58} p={1} />
							</div>
							<div style={{flex: 1}}>
								<div style={{fontFamily: F.display, fontWeight: 700, fontSize: 30 * u, color: C.text}}>bizwit agent</div>
								<div style={{fontFamily: F.mono, fontSize: 18 * u, color: '#34D399', letterSpacing: '0.1em'}}>● online</div>
							</div>
							<div style={{fontFamily: F.mono, fontSize: 22 * u, color: C.dim}}>02:14 am</div>
						</div>
						<div style={{position: 'absolute', left: 30 * u, right: 30 * u, top: 140 * u, display: 'flex', flexDirection: 'column', gap: 20 * u}}>
							<Bubble at={16}>hi, any 2bhk flats near my office under budget?</Bubble>
							{typing ? (
								<div style={{alignSelf: 'flex-end', display: 'flex', gap: 10 * u, padding: `${22 * u}px ${26 * u}px`, borderRadius: 26 * u, background: 'rgba(0,128,255,0.25)'}}>
									{[0, 1, 2].map((k) => (
										<span key={k} style={{width: 12 * u, height: 12 * u, borderRadius: '50%', background: '#fff', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + k * 4) / 5))}} />
									))}
								</div>
							) : null}
							{f >= 56 ? <Bubble at={56} me>yes! 3 options match. want a site visit on saturday?</Bubble> : null}
							<Bubble at={76}>saturday 11 am works</Bubble>
						</div>
						<div style={{position: 'absolute', left: 30 * u, right: 30 * u, bottom: 34 * u, ...center}}>
							<div style={{opacity: badge, transform: `scale(${0.6 + 0.4 * badge})`, display: 'flex', alignItems: 'center', gap: 16 * u, padding: `${16 * u}px ${28 * u}px`, borderRadius: 999, background: 'rgba(52,211,153,0.12)', border: `${1.5 * u}px solid rgba(52,211,153,0.5)`, boxShadow: `0 0 ${30 * u}px rgba(52,211,153,0.25)`, fontFamily: F.mono, fontSize: 22 * u, letterSpacing: '0.12em', color: '#6EE7B7', textTransform: 'uppercase'}}>
								✓ lead qualified · visit booked
							</div>
						</div>
					</EmbossPanel>
				</div>
			</CameraDrift>
		</AbsoluteFill>
	);
};

// 6 — dark chart slide with glowing line; side metric cards (illustrative UI values).
export const S6Data: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const panel = springAt(f, fps, 8, 'snappy');
	const score = Math.round(tween(f, [40, 95], [38, 92], EASE.out));
	const sent = tween(f, [50, 100], [0, 0.78], EASE.out);
	const Mini: React.FC<{at: number; label: string; children: React.ReactNode}> = ({at, label, children}) => {
		const s = springAt(f, fps, at, 'snappy');
		return (
			<div style={{position: 'relative', width: 380 * u, height: 220 * u, opacity: s, transform: `translateX(${(1 - s) * 60 * u}px)`}}>
				<EmbossPanel w={380} h={220} r={30}>
					<div style={{padding: 30 * u}}>
						<div style={{fontFamily: F.mono, fontSize: 18 * u, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dim}}>{label}</div>
						{children}
					</div>
				</EmbossPanel>
			</div>
		);
	};
	return (
		<AbsoluteFill style={{background: C.panel}}>
			<Glow color={C.accent} size={1500} opacity={0.18} y={70} />
			<Glow color={C.accent3} size={900} opacity={0.1} x={20} y={30} />
			<CameraDrift dur={dur} zoom={[1.06, 1]}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 96 * u, ...center, flexDirection: 'column', gap: 22 * u}}>
					<Eyebrow text="data & analytics ai" start={2} />
					<Headline text="turn data into decisions" em={['decisions']} start={4} size={100} align="center" />
				</div>
				<div style={{position: 'absolute', left: 150 * u, top: 360 * u, opacity: panel, transform: `translateY(${(1 - panel) * 60 * u}px)`}}>
					<EmbossPanel w={1100} h={600} r={36} glow={0.35}>
						<div style={{position: 'absolute', left: 50 * u, top: 40 * u, display: 'flex', gap: 30 * u, alignItems: 'center'}}>
							<div style={{fontFamily: F.display, fontWeight: 700, fontSize: 34 * u, color: C.text}}>qualified leads</div>
							<div style={{fontFamily: F.mono, fontSize: 18 * u, color: C.dim, letterSpacing: '0.14em'}}>WEEKLY · AUTO-REPORT</div>
						</div>
						<div style={{position: 'absolute', left: 50 * u, top: 130 * u}}>
							<GlowLine values={[12, 14, 13, 18, 17, 24, 22, 31, 36, 34, 45, 52]} start={16} dur={70} width={1000} height={400} />
						</div>
					</EmbossPanel>
				</div>
				<div style={{position: 'absolute', left: 1330 * u, top: 360 * u, display: 'flex', flexDirection: 'column', gap: 50 * u}}>
					<Mini at={30} label="lead score">
						<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 104 * u, letterSpacing: '-0.05em', color: C.text, lineHeight: 1.1, marginTop: 6 * u}}>
							{score}
							<span style={{fontSize: 40 * u, color: C.accent2}}> /100</span>
						</div>
					</Mini>
					<Mini at={40} label="customer sentiment">
						<div style={{marginTop: 34 * u, height: 22 * u, borderRadius: 999, background: 'rgba(0,0,0,0.5)', boxShadow: `inset 0 ${2 * u}px ${4 * u}px rgba(0,0,0,0.6)`, overflow: 'hidden'}}>
							<div style={{width: `${sent * 100}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${C.accent3}, ${C.accent2})`, boxShadow: `0 0 ${16 * u}px ${C.accent2}`}} />
						</div>
						<div style={{marginTop: 20 * u, fontFamily: F.display, fontWeight: 700, fontSize: 36 * u, color: C.text}}>mostly positive</div>
					</Mini>
				</div>
			</CameraDrift>
		</AbsoluteFill>
	);
};

// 7 — huge numerals with small captions.
export const S7Numbers: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const a = springAt(f, fps, 4, 'slam');
	const b = springAt(f, fps, 22, 'slam');
	const five = Math.round(tween(f, [22, 50], [0, 5], EASE.out));
	const big: React.CSSProperties = {
		fontFamily: F.display,
		fontWeight: 800,
		fontSize: 330 * u,
		letterSpacing: '-0.07em',
		lineHeight: 0.9,
		background: 'linear-gradient(180deg, #FFFFFF 10%, #7CC3FF 70%, #0080FF 100%)',
		WebkitBackgroundClip: 'text',
		color: 'transparent',
		filter: `drop-shadow(0 ${4 * u}px 0 rgba(0,40,120,0.6)) drop-shadow(0 0 ${40 * u}px rgba(0,128,255,0.35))`,
	};
	const cap = (at: number): React.CSSProperties => ({fontFamily: F.serif, fontStyle: 'italic', fontSize: 64 * u, color: C.muted, opacity: tween(f, [at, at + 14], [0, 1]), transform: `translateY(${(1 - tween(f, [at, at + 14], [0, 1])) * 20 * u}px)`, marginTop: 24 * u});
	const inds = ['real estate', 'e-commerce', 'hr', 'sales', 'marketing'];
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<OrbBg y={45} size={1500} intensity={0.7} />
			<CameraDrift dur={dur} zoom={[1, 1.05]}>
				<AbsoluteFill style={{...center, flexDirection: 'row', gap: 200 * u, top: -70 * u}}>
					<div style={{textAlign: 'center', transform: `scale(${1.6 - 0.6 * a})`, opacity: a, filter: `blur(${(1 - a) * 14 * u}px)`}}>
						<div style={big}>24/7</div>
						<div style={cap(16)}>always on</div>
					</div>
					<div style={{width: 2 * u, height: 360 * u, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)', opacity: tween(f, [14, 30], [0, 1])}} />
					<div style={{textAlign: 'center', transform: `scale(${1.6 - 0.6 * b})`, opacity: b, filter: `blur(${(1 - b) * 14 * u}px)`}}>
						<div style={big}>{five}+</div>
						<div style={cap(36)}>industries served</div>
					</div>
				</AbsoluteFill>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 150 * u, ...center, gap: 18 * u}}>
					{inds.map((t, i) => {
						const p = tween(f, [50 + i * 5, 64 + i * 5], [0, 1]);
						return (
							<div key={t} style={{opacity: p, transform: `translateY(${(1 - p) * 20 * u}px)`, padding: `${12 * u}px ${26 * u}px`, borderRadius: 999, fontFamily: F.mono, fontSize: 22 * u, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, background: 'linear-gradient(145deg, #161A26, #07090F)', border: `${1 * u}px solid rgba(255,255,255,0.07)`, boxShadow: `inset ${2 * u}px ${2 * u}px ${2 * u}px rgba(255,255,255,0.06), 0 ${10 * u}px ${24 * u}px rgba(0,0,0,0.6)`}}>
								{t}
							</div>
						);
					})}
				</div>
			</CameraDrift>
		</AbsoluteFill>
	);
};

// 8 — end card: emblem, wordmark, tagline, embossed pill CTA, url.
export const S8Outro: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const e = springAt(f, fps, 2, 'heavy');
	const word = springAt(f, fps, 14, 'heavy');
	const pill = springAt(f, fps, 50, 'snappy');
	const press = tween(f, [96, 101], [0, 1], EASE.snap) * tween(f, [104, 114], [1, 0]);
	const url = tween(f, [66, 80], [0, 1]);
	const cursorX = tween(f, [70, 96], [260, 40], EASE.inOut);
	const cursorY = tween(f, [70, 96], [160, 30], EASE.inOut);
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<OrbBg y={42} size={1500} intensity={1} />
			<NeuralField start={-30} dur={1} count={26} fade={0.22} />
			<CameraDrift dur={dur} zoom={[1.05, 1]}>
				<AbsoluteFill style={{...center, flexDirection: 'column'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 40 * u, marginTop: -60 * u}}>
						<div style={{transform: `scale(${0.5 + 0.5 * e})`, opacity: e}}>
							<Emblem size={170} p={e} pulse={0} />
						</div>
						<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 190 * u, letterSpacing: '-0.06em', lineHeight: 1, color: '#fff', opacity: word, transform: `translateX(${(1 - word) * -40 * u}px)`, filter: `blur(${(1 - word) * 12 * u}px)`, textShadow: `0 ${3 * u}px 0 rgba(0,40,120,0.5), 0 0 ${60 * u}px rgba(0,128,255,0.35)`}}>
							bizwitai
						</div>
					</div>
					<Headline text="ai solutions for modern businesses" em={['modern', 'businesses']} start={26} size={62} align="center" color={C.muted} style={{marginTop: 34 * u, fontWeight: 600}} />
					<div style={{position: 'relative', marginTop: 60 * u, opacity: pill, transform: `translateY(${(1 - pill) * 40 * u}px) scale(${(0.9 + 0.1 * pill) * (1 - press * 0.05)})`}}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 18 * u,
								padding: `${30 * u}px ${64 * u}px`,
								borderRadius: 999,
								fontFamily: F.display,
								fontWeight: 700,
								fontSize: 44 * u,
								color: '#fff',
								letterSpacing: '-0.01em',
								background: `linear-gradient(150deg, #3AA6FF 0%, ${C.accent} 50%, #0058D6 100%)`,
								boxShadow: [
									`inset ${3 * u}px ${3 * u}px ${5 * u}px rgba(255,255,255,${0.45 - press * 0.3})`,
									`inset -${4 * u}px -${5 * u}px ${8 * u}px rgba(0,20,70,0.5)`,
									`0 ${(18 - press * 12) * u}px ${(50 - press * 30) * u}px rgba(0,0,0,0.7)`,
									`0 0 ${(60 + press * 50) * u}px rgba(0,157,255,${0.5 + press * 0.3})`,
								].join(', '),
							}}
						>
							book a call <span style={{fontSize: 40 * u}}>→</span>
						</div>
						{f > 66 ? (
							<svg width={40 * u} height={48 * u} viewBox="0 0 40 48" style={{position: 'absolute', left: `calc(50% + ${cursorX * u}px)`, top: cursorY * u, opacity: tween(f, [66, 72], [0, 1]) * tween(f, [130, 140], [1, 0]), transform: `scale(${1 - press * 0.15})`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'}}>
								<path d="M3 2 L3 38 L13 29 L20 45 L27 42 L20 27 L34 27 Z" fill="#fff" stroke="#000" strokeWidth={2} strokeLinejoin="round" />
							</svg>
						) : null}
					</div>
					<div style={{marginTop: 46 * u, fontFamily: F.mono, fontSize: 30 * u, letterSpacing: '0.24em', color: C.dim, opacity: url}}>BIZWITAI.COM</div>
				</AbsoluteFill>
			</CameraDrift>
		</AbsoluteFill>
	);
};
