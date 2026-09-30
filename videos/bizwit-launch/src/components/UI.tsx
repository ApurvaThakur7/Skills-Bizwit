import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, brand} from '../brand';
import {EASE, SpringName, clamp, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

const src = (s: string) => (/^(https?:|data:)/.test(s) ? s : staticFile(s));

// Card that springs in. Give x/y (px @1080) for absolute placement, or omit to flow.
export const Card: React.FC<{
	x?: number; y?: number; w?: number; h?: number; bg?: string; delay?: number; from?: 'bottom' | 'left' | 'right' | 'scale' | 'none';
	radius?: number; padding?: number; tilt?: number; shadow?: boolean; border?: string; spring?: SpringName; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({x, y, w, h, bg = '#FFFFFF', delay = 0, from = 'bottom', radius = brand.radius, padding = 36, tilt = 0, shadow = true, border, spring = 'snappy', style, children}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const s = from === 'none' ? 1 : springAt(f, fps, delay, spring);
	const tr = {bottom: `translateY(${(1 - s) * 90 * u}px)`, left: `translateX(${(s - 1) * 140 * u}px)`, right: `translateX(${(1 - s) * 140 * u}px)`, scale: `scale(${0.85 + 0.15 * s})`, none: ''}[from];
	return (
		<div
			style={{
				position: x !== undefined ? 'absolute' : 'relative',
				left: x !== undefined ? x * u : undefined,
				top: y !== undefined ? y * u : undefined,
				width: w ? w * u : undefined,
				height: h ? h * u : undefined,
				background: bg,
				borderRadius: radius * u,
				padding: padding * u,
				boxSizing: 'border-box',
				overflow: 'hidden',
				border,
				boxShadow: shadow ? `0 ${24 * u}px ${60 * u}px rgba(0,0,0,0.12), 0 ${4 * u}px ${12 * u}px rgba(0,0,0,0.06)` : undefined,
				opacity: Math.min(1, s * 1.4),
				transform: `${tr} rotate(${tilt}deg)`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

// Floating notification / message card (chat, CRM, inbox style).
export const NotificationCard: React.FC<{
	name: string; message: string; time?: string; initials?: string; avatar?: string; avatarColor?: string; badge?: string; width?: number; dark?: boolean; style?: React.CSSProperties;
}> = ({name, message, time = 'now', initials, avatar, avatarColor = '#C9B8A6', badge, width = 460, dark = false, style}) => {
	const {u} = useLayout();
	const fg = dark ? C.text : C.ink;
	return (
		<div style={{width: width * u, display: 'flex', gap: 16 * u, alignItems: 'center', padding: `${16 * u}px ${20 * u}px`, borderRadius: 20 * u, background: dark ? 'rgba(30,30,38,0.92)' : 'rgba(255,255,255,0.96)', boxShadow: `0 ${18 * u}px ${40 * u}px rgba(0,0,0,0.10)`, fontFamily: F.body, ...style}}>
			<div style={{position: 'relative', flexShrink: 0, width: 52 * u, height: 52 * u, borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 * u, overflow: 'visible'}}>
				{avatar ? <Img src={src(avatar)} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : (initials ?? name.split(' ').map((p) => p[0]).join('').slice(0, 2))}
				{badge ? <div style={{position: 'absolute', right: -4 * u, bottom: -4 * u, width: 20 * u, height: 20 * u, borderRadius: 6 * u, background: badge, border: `${2 * u}px solid #fff`}} /> : null}
			</div>
			<div style={{flex: 1, minWidth: 0}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
					<span style={{fontWeight: 700, fontSize: 21 * u, color: fg}}>{name}</span>
					<span style={{fontSize: 15 * u, color: C.accent, marginLeft: 12 * u}}>{time}</span>
				</div>
				<div style={{fontSize: 19 * u, color: fg, opacity: 0.65, marginTop: 4 * u, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{message}</div>
			</div>
		</div>
	);
};

// Browser window. Show a screenshot (public/ path) that scrolls, or pass children (mock UI).
export const BrowserFrame: React.FC<{
	width?: number; height?: number; url?: string; image?: string; scrollFrom?: number; scrollTo?: number; scrollStart?: number; scrollEnd?: number; dark?: boolean; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({width = 1400, height = 820, url = brand.url, image, scrollFrom = 0, scrollTo = 0, scrollStart = 0, scrollEnd = 90, dark = false, style, children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const y = tween(f, [scrollStart, scrollEnd], [scrollFrom, scrollTo], EASE.inOut);
	const bar = dark ? '#1E1E26' : '#F1EFEC';
	return (
		<div style={{width: width * u, height: height * u, borderRadius: 18 * u, overflow: 'hidden', background: dark ? '#111117' : '#fff', boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.25)`, border: `1px solid ${dark ? '#2A2A33' : '#E4E1DC'}`, ...style}}>
			<div style={{height: 52 * u, background: bar, display: 'flex', alignItems: 'center', padding: `0 ${20 * u}px`, gap: 10 * u}}>
				{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 14 * u, height: 14 * u, borderRadius: '50%', background: c}} />)}
				<div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
					<div style={{padding: `${7 * u}px ${24 * u}px`, borderRadius: 10 * u, background: dark ? '#2A2A33' : '#fff', fontFamily: F.body, fontSize: 16 * u, color: dark ? '#aaa' : '#666', minWidth: 360 * u, textAlign: 'center'}}>{url}</div>
				</div>
			</div>
			<div style={{position: 'relative', height: (height - 52) * u, overflow: 'hidden'}}>
				{image ? <Img src={src(image)} style={{width: '100%', display: 'block', transform: `translateY(${-y * u}px)`}} /> : <div style={{position: 'absolute', inset: 0, transform: `translateY(${-y * u}px)`}}>{children}</div>}
			</div>
		</div>
	);
};

// Phone mockup. image = screenshot in public/, or children.
export const PhoneFrame: React.FC<{height?: number; image?: string; scrollFrom?: number; scrollTo?: number; scrollStart?: number; scrollEnd?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
	height = 820, image, scrollFrom = 0, scrollTo = 0, scrollStart = 0, scrollEnd = 90, style, children,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const w = height * 0.49;
	const y = tween(f, [scrollStart, scrollEnd], [scrollFrom, scrollTo], EASE.inOut);
	return (
		<div style={{width: w * u, height: height * u, borderRadius: 64 * u, background: '#0E0E12', padding: 14 * u, boxSizing: 'border-box', boxShadow: `0 ${40 * u}px ${90 * u}px rgba(0,0,0,0.35)`, ...style}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52 * u, overflow: 'hidden', background: '#fff'}}>
				{image ? <Img src={src(image)} style={{width: '100%', display: 'block', transform: `translateY(${-y * u}px)`}} /> : <div style={{position: 'absolute', inset: 0, transform: `translateY(${-y * u}px)`}}>{children}</div>}
				<div style={{position: 'absolute', top: 14 * u, left: '50%', transform: 'translateX(-50%)', width: 120 * u, height: 34 * u, borderRadius: 20 * u, background: '#0E0E12'}} />
			</div>
		</div>
	);
};

// Cursor moving through points {x,y (px @1080), f (frame)} with click ripples at `clicks`.
export const Cursor: React.FC<{points: {x: number; y: number; f: number}[]; clicks?: number[]; color?: string; size?: number}> = ({points, clicks = [], color = C.ink, size = 34}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	if (!points.length) return null;
	let x = points[0].x;
	let y = points[0].y;
	for (let i = 0; i < points.length - 1; i++) {
		const a = points[i];
		const b = points[i + 1];
		if (f >= a.f) {
			x = tween(f, [a.f, b.f], [a.x, b.x], EASE.inOut);
			y = tween(f, [a.f, b.f], [a.y, b.y], EASE.inOut);
		}
	}
	const press = clicks.some((c) => f >= c && f < c + 5) ? 0.85 : 1;
	const opacity = tween(f, [points[0].f - 8, points[0].f], [0, 1]);
	return (
		<>
			{clicks.map((c) => {
				const p = tween(f, [c, c + 18], [0, 1]);
				if (f < c || p >= 1) return null;
				return <div key={c} style={{position: 'absolute', left: x * u - 30 * u * p, top: y * u - 30 * u * p, width: 60 * u * p, height: 60 * u * p, borderRadius: '50%', border: `${3 * u}px solid ${C.accent}`, opacity: 1 - p}} />;
			})}
			<svg width={size * u} height={size * 1.3 * u} viewBox="0 0 20 26" style={{position: 'absolute', left: x * u, top: y * u, opacity, transform: `scale(${press})`, transformOrigin: 'top left', filter: `drop-shadow(0 ${3 * u}px ${6 * u}px rgba(0,0,0,0.3))`}}>
				<path d="M1 1 L1 21 L6 16 L10 25 L13 24 L9 15 L16 15 Z" fill={color} stroke="#fff" strokeWidth={1.3} />
			</svg>
		</>
	);
};

export const Button: React.FC<{label: string; pressAt?: number; bg?: string; color?: string; pressedLabel?: string; pressedBg?: string; size?: number; style?: React.CSSProperties}> = ({label, pressAt, bg = C.ink, color = '#fff', pressedLabel, pressedBg, size = 24, style}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const pressed = pressAt !== undefined && f >= pressAt;
	const scale = pressAt !== undefined && f >= pressAt && f < pressAt + 5 ? 0.92 : 1;
	return (
		<div style={{display: 'inline-block', padding: `${18 * u}px ${36 * u}px`, borderRadius: 999, background: pressed && pressedBg ? pressedBg : bg, color, fontFamily: F.body, fontWeight: 600, fontSize: size * u, transform: `scale(${scale})`, ...style}}>
			{pressed && pressedLabel ? pressedLabel : label}
		</div>
	);
};

export const Toggle: React.FC<{at: number; onColor?: string; offColor?: string; size?: number}> = ({at, onColor = C.accent, offColor = 'rgba(0,0,0,0.18)', size = 1}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [at, at + 8], [0, 1], EASE.snap);
	return (
		<div style={{position: 'relative', width: 120 * u * size, height: 64 * u * size, borderRadius: 999, background: p > 0.5 ? onColor : offColor}}>
			<div style={{position: 'absolute', top: 7 * u * size, left: (7 + p * 56) * u * size, width: 50 * u * size, height: 50 * u * size, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
		</div>
	);
};

export const ProgressRing: React.FC<{value: number; start?: number; dur?: number; size?: number; stroke?: number; color?: string; track?: string; label?: string; labelColor?: string}> = ({
	value, start = 0, dur = 45, size = 200, stroke = 16, color = C.accent, track = 'rgba(128,128,128,0.2)', label, labelColor = C.text,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + dur], [0, value], EASE.out);
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size * u, height: size * u}}>
			<svg width={size * u} height={size * u} viewBox={`0 0 ${size} ${size}`}>
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 700, fontSize: size * 0.24 * u, color: labelColor}}>{label ?? `${Math.round(p * 100)}%`}</div>
		</div>
	);
};

export const BarChart: React.FC<{values: number[]; labels?: string[]; start?: number; stagger?: number; width?: number; height?: number; color?: string; highlight?: number; highlightColor?: string; labelColor?: string}> = ({
	values, labels, start = 0, stagger = 4, width = 600, height = 300, color = C.accent2, highlight, highlightColor = C.accent, labelColor = C.muted,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const max = Math.max(...values);
	const bw = width / values.length;
	return (
		<div style={{display: 'flex', alignItems: 'flex-end', gap: bw * 0.25 * u, width: width * u, height: height * u}}>
			{values.map((v, i) => {
				const s = springAt(f, fps, start + i * stagger, 'snappy');
				return (
					<div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
						<div style={{width: '100%', height: `${(v / max) * 100 * s}%`, background: i === highlight ? highlightColor : color, borderRadius: 10 * u}} />
						{labels ? <div style={{marginTop: 10 * u, fontFamily: F.mono, fontSize: 14 * u, color: labelColor}}>{labels[i]}</div> : null}
					</div>
				);
			})}
		</div>
	);
};

// Line chart that draws itself; optional gradient area.
export const LineChart: React.FC<{values: number[]; start?: number; dur?: number; width?: number; height?: number; color?: string; area?: boolean; strokeWidth?: number; dot?: boolean}> = ({
	values, start = 0, dur = 45, width = 700, height = 260, color = C.accent, area = true, strokeWidth = 5, dot = true,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + dur], [0, 1], EASE.inOut);
	const max = Math.max(...values);
	const min = Math.min(...values);
	const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - ((v - min) / (max - min || 1)) * (height * 0.9) - height * 0.05]);
	const d = pts.map(([x, y], i) => {
		if (i === 0) return `M${x},${y}`;
		const [px, py] = pts[i - 1];
		const cx = (px + x) / 2;
		return `C${cx},${py} ${cx},${y} ${x},${y}`;
	}).join(' ');
	const idx = Math.min(pts.length - 1, Math.floor(p * (pts.length - 1)));
	const gid = `lg${color.replace('#', '')}`;
	return (
		<svg width={width * u} height={height * u} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={color} stopOpacity={0.35} />
					<stop offset="1" stopColor={color} stopOpacity={0} />
				</linearGradient>
				<clipPath id={`${gid}c`}>
					<rect x={0} y={-20} width={width * p} height={height + 40} />
				</clipPath>
			</defs>
			{area ? <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${gid})`} clipPath={`url(#${gid}c)`} /> : null}
			<path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
			{dot && p > 0.02 ? <circle cx={pts[idx][0] + (p * (pts.length - 1) - idx) * (width / (pts.length - 1))} cy={pts[idx][1]} r={strokeWidth * 1.8} fill={color} stroke="#fff" strokeWidth={3} /> : null}
		</svg>
	);
};

// Row of app icons with badge counters ticking up.
export const AppDock: React.FC<{apps: {color: string; label?: string; count?: number; icon?: string}[]; start?: number; size?: number; gap?: number; stagger?: number}> = ({apps, start = 0, size = 72, gap = 22, stagger = 3}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	return (
		<div style={{display: 'flex', gap: gap * u}}>
			{apps.map((a, i) => {
				const s = springAt(f, fps, start + i * stagger, 'bouncy');
				const n = a.count ? Math.round(interpolate(f, [start + 10 + i * stagger, start + 40 + i * stagger], [0, a.count], clamp)) : 0;
				return (
					<div key={i} style={{position: 'relative', width: size * u, height: size * u, borderRadius: size * 0.26 * u, background: a.color, transform: `scale(${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: F.display, fontWeight: 800, fontSize: size * 0.42 * u, boxShadow: `0 ${8 * u}px ${20 * u}px rgba(0,0,0,0.15)`}}>
						{a.icon ? <Img src={src(a.icon)} style={{width: '62%', height: '62%', objectFit: 'contain'}} /> : a.label}
						{a.count ? <div style={{position: 'absolute', top: -10 * u, right: -10 * u, minWidth: 30 * u, height: 30 * u, padding: `0 ${7 * u}px`, boxSizing: 'border-box', borderRadius: 999, background: '#FF3B30', color: '#fff', fontFamily: F.body, fontSize: 16 * u, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `${2 * u}px solid #fff`}}>{n}</div> : null}
					</div>
				);
			})}
		</div>
	);
};

export const Pill: React.FC<{text: string; bg?: string; color?: string; size?: number; dot?: string; style?: React.CSSProperties}> = ({text, bg = 'rgba(255,255,255,0.08)', color = C.text, size = 20, dot, style}) => {
	const {u} = useLayout();
	return (
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 10 * u, padding: `${10 * u}px ${20 * u}px`, borderRadius: 999, background: bg, color, fontFamily: F.body, fontWeight: 500, fontSize: size * u, border: '1px solid rgba(255,255,255,0.12)', ...style}}>
			{dot ? <span style={{width: 10 * u, height: 10 * u, borderRadius: '50%', background: dot}} /> : null}
			{text}
		</div>
	);
};
