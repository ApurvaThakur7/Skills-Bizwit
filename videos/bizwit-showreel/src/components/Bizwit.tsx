import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../brand';
import {EASE, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

// Signature pieces for the BizwitAI reel: dark embossed panels, a glossy "B" emblem,
// neural lines that converge, chromatic slam words and serif-emphasis headlines.

// Dark neumorphic panel: top-left highlight, bottom-right shade, deep drop shadow.
export const EmbossPanel: React.FC<{w: number; h: number; r?: number; glow?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({w, h, r = 32, glow = 0, style, children}) => {
	const {u} = useLayout();
	return (
		<div
			style={{
				position: 'absolute',
				width: w * u,
				height: h * u,
				borderRadius: r * u,
				background: `linear-gradient(145deg, #161A26 0%, ${C.surface} 45%, #07090F 100%)`,
				border: `${1 * u}px solid rgba(255,255,255,0.07)`,
				boxShadow: [
					`inset ${2 * u}px ${2 * u}px ${2 * u}px rgba(255,255,255,0.07)`,
					`inset -${3 * u}px -${3 * u}px ${6 * u}px rgba(0,0,0,0.6)`,
					`0 ${40 * u}px ${90 * u}px rgba(0,0,0,0.75)`,
					`-${10 * u}px -${10 * u}px ${30 * u}px rgba(255,255,255,0.025)`,
					glow ? `0 0 ${120 * u}px rgba(0,128,255,${0.35 * glow})` : '0 0 0 transparent',
				].join(', '),
				overflow: 'hidden',
				...style,
			}}
		>
			{children}
		</div>
	);
};

// Glossy embossed app-icon style "B" tile. `p` 0→1 = pressed-out amount.
export const Emblem: React.FC<{size?: number; p?: number; pulse?: number}> = ({size = 260, p = 1, pulse = 0}) => {
	const {u} = useLayout();
	const s = size * u;
	const depth = 18 * p;
	return (
		<div style={{position: 'relative', width: s, height: s}}>
			<div style={{position: 'absolute', inset: -s * 0.6, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,128,255,${0.55 * p + pulse * 0.3}) 0%, rgba(129,74,200,${0.18 * p}) 40%, transparent 70%)`, filter: `blur(${20 * u}px)`}} />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: s * 0.26,
					background: `linear-gradient(150deg, #3AA6FF 0%, ${C.accent} 42%, #0050C8 100%)`,
					boxShadow: [
						`inset ${6 * u}px ${6 * u}px ${10 * u}px rgba(255,255,255,${0.45 * p})`,
						`inset -${8 * u}px -${10 * u}px ${16 * u}px rgba(0,20,70,${0.55 * p})`,
						`0 ${depth * u}px ${depth * 3 * u}px rgba(0,0,0,0.7)`,
						`0 0 ${60 * u * p}px rgba(0,157,255,${0.6 * p})`,
					].join(', '),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{/* glossy top sheen */}
				<div style={{position: 'absolute', left: '8%', right: '8%', top: '5%', height: '42%', borderRadius: s * 0.22, background: 'linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0))'}} />
				<div
					style={{
						fontFamily: F.display,
						fontWeight: 800,
						fontSize: s * 0.62,
						lineHeight: 1,
						color: '#fff',
						letterSpacing: '-0.04em',
						marginTop: -s * 0.04,
						textShadow: `0 ${3 * u}px 0 rgba(0,30,90,0.55), 0 -${1.5 * u}px 0 rgba(255,255,255,0.5), 0 ${10 * u}px ${24 * u}px rgba(0,0,0,0.4)`,
					}}
				>
					b
				</div>
			</div>
		</div>
	);
};

// Lines from scattered points converging on the centre, with travelling sparks.
export const NeuralField: React.FC<{start?: number; dur?: number; count?: number; fade?: number}> = ({start = 0, dur = 40, count = 34, fade = 1}) => {
	const f = useCurrentFrame();
	const {w, h} = useLayout();
	const cx = w / 2;
	const cy = h / 2;
	const nodes = new Array(count).fill(0).map((_, i) => {
		const a = random(`a${i}`) * Math.PI * 2;
		const r = 420 + random(`r${i}`) * 700;
		return {x: cx + Math.cos(a) * r * (w / h) * 0.7, y: cy + Math.sin(a) * r * 0.7, d: random(`d${i}`) * 14};
	});
	return (
		<svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: fade}}>
			<defs>
				<linearGradient id="nf" x1="0" x2="1">
					<stop offset="0" stopColor={C.accent3} stopOpacity={0} />
					<stop offset="1" stopColor={C.accent2} stopOpacity={0.9} />
				</linearGradient>
			</defs>
			{nodes.map((n, i) => {
				const p = tween(f, [start + n.d, start + n.d + dur], [0, 1], EASE.inOut);
				const mx = (n.x + cx) / 2 + (random(`m${i}`) - 0.5) * 260;
				const my = (n.y + cy) / 2 + (random(`n${i}`) - 0.5) * 260;
				const path = `M${n.x},${n.y} Q${mx},${my} ${cx},${cy}`;
				const spark = (f * 0.02 + random(`s${i}`)) % 1;
				return (
					<g key={i}>
						<path d={path} fill="none" stroke={i % 5 === 0 ? C.accent3 : C.accent} strokeOpacity={0.35} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
						<circle cx={n.x} cy={n.y} r={3} fill={C.muted} opacity={0.5 * p} />
						{p > 0.95 ? <Spark path={[n.x, n.y, mx, my, cx, cy]} t={spark} /> : null}
					</g>
				);
			})}
		</svg>
	);
};

const Spark: React.FC<{path: number[]; t: number}> = ({path: [x0, y0, x1, y1, x2, y2], t}) => {
	const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
	const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
	return <circle cx={x} cy={y} r={3.5} fill="#BFE3FF" style={{filter: 'drop-shadow(0 0 6px #009DFF)'}} />;
};

// A word that slams in: scale-down + blur + RGB split that collapses to zero.
export const ChromaWord: React.FC<{text: string; at: number; size: number; color?: string; font?: string; italic?: boolean; weight?: number; style?: React.CSSProperties}> = ({
	text, at, size, color = C.text, font = F.display, italic = false, weight = 800, style,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const lf = f - at;
	if (lf < 0) return <span style={{display: 'inline-block', opacity: 0, fontFamily: font, fontSize: size * u, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', ...style}}>{text}</span>;
	const s = springAt(lf, fps, 0, 'slam');
	const scale = 1.8 - 0.8 * s;
	const blur = tween(lf, [0, 8], [18, 0]);
	const split = tween(lf, [0, 14], [26, 0]) * u;
	const base: React.CSSProperties = {fontFamily: font, fontSize: size * u, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', lineHeight: 1, letterSpacing: italic ? '-0.01em' : '-0.045em', whiteSpace: 'nowrap'};
	return (
		<span style={{position: 'relative', display: 'inline-block', transform: `scale(${scale})`, filter: `blur(${blur * u}px)`, opacity: tween(lf, [0, 4], [0, 1]), ...style}}>
			{split > 0.5 ? (
				<>
					<span style={{...base, position: 'absolute', left: -split, top: 0, color: '#FF2D55', mixBlendMode: 'screen', opacity: 0.8}}>{text}</span>
					<span style={{...base, position: 'absolute', left: split, top: 0, color: '#00E0FF', mixBlendMode: 'screen', opacity: 0.8}}>{text}</span>
				</>
			) : null}
			<span style={{...base, position: 'relative', color}}>{text}</span>
		</span>
	);
};

// Headline whose words blur in; words listed in `em` render in Instrument Serif italic blue.
export const Headline: React.FC<{text: string; em?: string[]; start?: number; size?: number; stagger?: number; align?: 'left' | 'center'; color?: string; emColor?: string; style?: React.CSSProperties}> = ({
	text, em = [], start = 0, size = 96, stagger = 4, align = 'left', color = C.text, emColor = C.accent2, style,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const words = text.split(' ');
	return (
		<div style={{fontFamily: F.display, fontWeight: 700, fontSize: size * u, lineHeight: 1.02, letterSpacing: '-0.04em', color, textAlign: align, ...style}}>
			{words.map((wd, i) => {
				const p = tween(f, [start + i * stagger, start + i * stagger + 16], [0, 1]);
				const isEm = em.includes(wd);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							marginRight: '0.24em',
							opacity: p,
							filter: `blur(${(1 - p) * 14 * u}px)`,
							transform: `translateY(${(1 - p) * 30 * u}px)`,
							...(isEm ? {fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.01em', color: emColor, fontSize: size * 1.12 * u, textShadow: `0 0 ${40 * u}px rgba(0,157,255,0.45)`} : {}),
						}}
					>
						{wd}
					</span>
				);
			})}
		</div>
	);
};

// Small mono eyebrow with a live dot.
export const Eyebrow: React.FC<{text: string; start?: number; dot?: string; style?: React.CSSProperties}> = ({text, start = 0, dot = C.accent2, style}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + 14], [0, 1]);
	const blink = 0.55 + 0.45 * Math.sin(f / 5);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14 * u, fontFamily: F.mono, fontSize: 22 * u, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dim, opacity: p, transform: `translateX(${(1 - p) * -20 * u}px)`, ...style}}>
			<span style={{width: 10 * u, height: 10 * u, borderRadius: '50%', background: dot, opacity: blink, boxShadow: `0 0 ${12 * u}px ${dot}`}} />
			{text}
		</div>
	);
};

// Soft blue orb + faint violet haze used behind most scenes (mirrors the site's glow orb).
export const OrbBg: React.FC<{x?: number; y?: number; size?: number; intensity?: number}> = ({x = 50, y = 50, size = 1100, intensity = 1}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const breathe = 1 + Math.sin(f / 30) * 0.04;
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: size * u * breathe, height: size * u * breathe, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, rgba(0,128,255,${0.28 * intensity}) 0%, rgba(0,80,200,${0.12 * intensity}) 35%, rgba(129,74,200,${0.06 * intensity}) 55%, transparent 70%)`}} />
		</AbsoluteFill>
	);
};

// Glowing chart line with bright moving head.
export const GlowLine: React.FC<{values: number[]; start?: number; dur?: number; width: number; height: number}> = ({values, start = 0, dur = 60, width, height}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + dur], [0, 1], EASE.inOut);
	const max = Math.max(...values);
	const min = Math.min(...values);
	const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - ((v - min) / (max - min)) * height * 0.86 - height * 0.07]);
	const d = pts.map(([x, y], i) => {
		if (i === 0) return `M${x},${y}`;
		const [px, py] = pts[i - 1];
		const cx = (px + x) / 2;
		return `C${cx},${py} ${cx},${y} ${x},${y}`;
	}).join(' ');
	const seg = p * (pts.length - 1);
	const i0 = Math.min(pts.length - 2, Math.floor(seg));
	const t = seg - i0;
	const [ax, ay] = pts[i0];
	const [bx, by] = pts[i0 + 1];
	const e = t * t * (3 - 2 * t);
	const hx = ax + (bx - ax) * t;
	const hy = ay + (by - ay) * e;
	return (
		<svg width={width * u} height={height * u} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="gla" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={C.accent} stopOpacity={0.4} />
					<stop offset="1" stopColor={C.accent} stopOpacity={0} />
				</linearGradient>
				<linearGradient id="gls" x1="0" x2="1">
					<stop offset="0" stopColor={C.accent3} />
					<stop offset="1" stopColor={C.accent2} />
				</linearGradient>
				<clipPath id="glc">
					<rect x={-10} y={-40} width={hx + 10} height={height + 80} />
				</clipPath>
			</defs>
			{[0, 1, 2, 3].map((k) => (
				<line key={k} x1={0} x2={width} y1={(height / 4) * k + 10} y2={(height / 4) * k + 10} stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} strokeDasharray="6 10" />
			))}
			<path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#gla)" clipPath="url(#glc)" />
			<path d={d} fill="none" stroke="url(#gls)" strokeWidth={14} strokeOpacity={0.25} strokeLinecap="round" clipPath="url(#glc)" style={{filter: 'blur(8px)'}} />
			<path d={d} fill="none" stroke="url(#gls)" strokeWidth={5} strokeLinecap="round" clipPath="url(#glc)" />
			{p > 0.01 ? (
				<g>
					<circle cx={hx} cy={hy} r={26} fill={C.accent2} opacity={0.25} style={{filter: 'blur(6px)'}} />
					<circle cx={hx} cy={hy} r={9} fill="#fff" style={{filter: 'drop-shadow(0 0 10px #009DFF)'}} />
				</g>
			) : null}
		</svg>
	);
};
