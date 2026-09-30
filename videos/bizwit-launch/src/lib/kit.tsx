import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, hash, tween} from './anim';

// ---------- backgrounds ----------

// Soft cool-white canvas with grey vignette (reference light scenes: #FAFAFA centre → #E6E6E6 edges).
export const Paper: React.FC<{glow?: number}> = ({glow = 0}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 45%, #FBFCFE 0%, ${C.paper} 45%, ${C.paperEdge} 100%)`}}>
		{glow > 0 && (
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, rgba(0,128,255,${0.1 * glow}) 0%, rgba(0,128,255,0) 32%)`}} />
		)}
	</AbsoluteFill>
);

// Dark space with faint stars (fixed, deterministic) + optional twinkle.
export const Space: React.FC<{stars?: number; seed?: number}> = ({stars = 140, seed = 3}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.space}}>
			<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
				{Array.from({length: stars}, (_, i) => {
					const x = hash(i * 3.1 + seed) * 1920;
					const y = hash(i * 7.7 + seed) * 1080;
					const r = 0.6 + hash(i * 1.3 + seed) * 1.3;
					const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 14 + i));
					return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={tw * (0.4 + hash(i) * 0.6)} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

// Big soft brand orb (the bizwitai.com hero glow). Layered rings like the reference's orange halo.
export const Orb: React.FC<{size?: number; x?: number; y?: number; strength?: number; color?: string}> = ({
	size = 900,
	x = 50,
	y = 50,
	strength = 1,
	color = '0,128,255',
}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				transform: 'translate(-50%,-50%)',
				borderRadius: '50%',
				background: `radial-gradient(circle, rgba(${color},${0.34 * strength}) 0%, rgba(${color},${0.2 * strength}) 22%, rgba(${color},${0.09 * strength}) 42%, rgba(${color},${0.035 * strength}) 58%, rgba(${color},0) 70%)`,
			}}
		/>
	</AbsoluteFill>
);

// ---------- logo (tintable via CSS mask so the white PNGs work on light or dark) ----------

export const Tint: React.FC<{src: string; w: number; h: number; color: string; style?: React.CSSProperties}> = ({src, w, h, color, style}) => (
	<div
		style={{
			width: w,
			height: h,
			background: color,
			WebkitMaskImage: `url(${staticFile(src)})`,
			WebkitMaskSize: '100% 100%',
			maskImage: `url(${staticFile(src)})`,
			maskSize: '100% 100%',
			...style,
		}}
	/>
);

// BIZ/WIT mark (cropped square-ish: 462×463).
export const Mark: React.FC<{size: number; color?: string; style?: React.CSSProperties}> = ({size, color = C.text, style}) => (
	<Tint src="assets/mark.png" w={size} h={size * (463 / 462)} color={color} style={style} />
);

// Wordmark letter slices in source px (512×105): B i z w i t | A I
export const WORD_SLICES: [number, number][] = [
	[0, 85],
	[85, 118],
	[118, 180],
	[180, 293],
	[293, 322],
	[322, 390],
	[390, 493],
	[493, 512],
];

// Wordmark whose letters drop in one by one with vertical motion blur (reference: "ClimbX" letters fall in).
export const WordmarkDrop: React.FC<{height: number; start: number; color?: string; stagger?: number; from?: number}> = ({
	height,
	start,
	color = C.ink,
	stagger = 1.4,
	from = -1.2,
}) => {
	const f = useCurrentFrame();
	const k = height / 105;
	return (
		<div style={{position: 'relative', width: 512 * k, height}}>
			{WORD_SLICES.map(([a, b], i) => {
				const t0 = start + i * stagger;
				const p = tween(f, [t0, t0 + 7], [0, 1], EASE.out);
				const y = (1 - p) * from * height;
				const vel = Math.abs(tween(f, [t0, t0 + 7], [1, 0], EASE.out));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: a * k,
							top: 0,
							width: (b - a) * k,
							height,
							overflow: 'visible',
							opacity: f < t0 ? 0 : Math.min(1, (f - t0) / 2 + 0.3),
							transform: `translateY(${y}px) scaleY(${1 + vel * 0.5})`,
							filter: vel > 0.05 ? `blur(${vel * 6}px)` : undefined,
						}}
					>
						<div style={{position: 'absolute', left: -a * k, top: 0, width: 512 * k, height, clipPath: `inset(0 ${(512 - b) * k}px 0 ${a * k}px)`}}>
							<Tint src="assets/bizwit-wordmark.png" w={512 * k} h={height} color={color} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- type ----------

export type Seg = {t: string; accent?: boolean; serif?: boolean};

// Word slam: each word lands from scale `from` + blur to rest (reference question + headlines).
export const SlamLine: React.FC<{
	words: Seg[];
	times: number[];
	size: number;
	color?: string;
	accent?: string;
	dur?: number;
	from?: number;
	blur?: number;
	weight?: number;
	style?: React.CSSProperties;
}> = ({words, times, size, color = C.ink, accent = C.accent, dur = 5, from = 1.55, blur = 16, weight = 800, style}) => {
	const f = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'baseline', whiteSpace: 'pre', ...style}}>
			{words.map((w, i) => {
				const t0 = times[i] ?? times[times.length - 1];
				const p = tween(f, [t0, t0 + dur], [0, 1], EASE.out);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							fontFamily: w.serif ? F.serif : F.display,
							fontStyle: w.serif ? 'italic' : 'normal',
							fontWeight: w.serif ? 400 : weight,
							fontSize: w.serif ? size * 1.12 : size,
							letterSpacing: w.serif ? '-0.01em' : '-0.05em',
							lineHeight: 1,
							color: w.accent ? accent : color,
							opacity: f < t0 ? 0 : interpolate(p, [0, 0.35], [0, 1], clamp),
							transform: `scale(${interpolate(p, [0, 1], [from, 1])})`,
							transformOrigin: '50% 60%',
							filter: p < 1 ? `blur(${(1 - p) * blur}px)` : undefined,
							marginRight: i < words.length - 1 ? size * 0.24 : 0,
						}}
					>
						{w.t}
					</span>
				);
			})}
		</div>
	);
};

// Char type-on with a small drop (reference "make it yours." / "your week, handled.").
export const DropChars: React.FC<{
	segs: Seg[];
	start: number;
	cps?: number; // frames per char
	size: number;
	color?: string;
	accent?: string;
	weight?: number;
	style?: React.CSSProperties;
}> = ({segs, start, cps = 1.2, size, color = C.ink, accent = C.accent, weight = 800, style}) => {
	const f = useCurrentFrame();
	let n = 0;
	return (
		<div style={{whiteSpace: 'pre', lineHeight: 1, ...style}}>
			{segs.map((s, si) => (
				<span key={si} style={{color: s.accent ? accent : color}}>
					{s.t.split('').map((ch, ci) => {
						const t0 = start + n++ * cps;
						const p = tween(f, [t0, t0 + 6], [0, 1], EASE.out);
						return (
							<span
								key={ci}
								style={{
									display: 'inline-block',
									fontFamily: s.serif ? F.serif : F.display,
									fontStyle: s.serif ? 'italic' : 'normal',
									fontWeight: s.serif ? 400 : weight,
									fontSize: s.serif ? size * 1.12 : size,
									letterSpacing: s.serif ? '-0.01em' : '-0.045em',
									opacity: f < t0 ? 0 : p,
									transform: `translateY(${(1 - p) * size * 0.55}px) scale(${1 + (1 - p) * 0.25})`,
									filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
								}}
							>
								{ch}
							</span>
						);
					})}
				</span>
			))}
		</div>
	);
};

// Plain typewriter (text inside UI cards).
export const typed = (text: string, f: number, start: number, cpf = 1.6) => text.slice(0, Math.max(0, Math.floor((f - start) * cpf)));

export const Caret: React.FC<{color?: string; h?: number}> = ({color = C.accent, h = 22}) => {
	const f = useCurrentFrame();
	return <span style={{display: 'inline-block', width: 2, height: h, background: color, marginLeft: 2, verticalAlign: 'middle', opacity: Math.floor(f / 8) % 2 ? 0.2 : 1}} />;
};

// ---------- motion helpers ----------

// Directional smear: n offset ghost copies along a vector (cheap motion blur for whips).
export const Smear: React.FC<{dx?: number; dy?: number; n?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({dx = 0, dy = 0, n = 6, children, style}) => {
	if (Math.abs(dx) + Math.abs(dy) < 1) return <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>;
	return (
		<div style={{position: 'absolute', inset: 0, ...style}}>
			{Array.from({length: n}, (_, i) => {
				const t = i / (n - 1) - 0.5;
				return (
					<div key={i} style={{position: 'absolute', inset: 0, opacity: 1 / n + (i === n - 1 ? 0.15 : 0), transform: `translate(${dx * t}px, ${dy * t}px)`}}>
						{children}
					</div>
				);
			})}
		</div>
	);
};

// Radial speed ticks bursting outward (reference white/orange bursts).
export const Burst: React.FC<{start: number; color?: string; n?: number; cx?: number; cy?: number; len?: number; reach?: number; dur?: number; width?: number}> = ({
	start,
	color = C.accent,
	n = 26,
	cx = 960,
	cy = 540,
	len = 60,
	reach = 900,
	dur = 14,
	width = 4,
}) => {
	const f = useCurrentFrame();
	const p = (f - start) / dur;
	if (p < 0 || p > 1.2) return null;
	return (
		<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => {
				const a = (i / n) * Math.PI * 2 + hash(i) * 0.2;
				const r0 = 120 + EASE.out(Math.min(1, p)) * reach * (0.6 + hash(i + 9) * 0.5);
				const l = len * (0.6 + hash(i + 4)) * (1 - Math.min(1, p) * 0.6);
				return (
					<line
						key={i}
						x1={cx + Math.cos(a) * r0}
						y1={cy + Math.sin(a) * r0}
						x2={cx + Math.cos(a) * (r0 + l)}
						y2={cy + Math.sin(a) * (r0 + l)}
						stroke={color}
						strokeWidth={width}
						strokeLinecap="round"
						opacity={1 - Math.min(1, p)}
					/>
				);
			})}
		</svg>
	);
};

// Particle explosion that slows and drifts (reference logo bursts: accent + ink specks).
export const Particles: React.FC<{start: number; n?: number; cx?: number; cy?: number; reach?: number; colors?: string[]; life?: number; size?: number}> = ({
	start,
	n = 46,
	cx = 960,
	cy = 540,
	reach = 520,
	colors = [C.accent, C.ink, C.accent2],
	life = 60,
	size = 7,
}) => {
	const f = useCurrentFrame();
	const t = f - start;
	if (t < 0 || t > life) return null;
	const p = t / life;
	return (
		<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => {
				const a = hash(i * 2.3) * Math.PI * 2;
				const d = reach * (0.25 + hash(i * 5.1) * 0.75) * EASE.out(Math.min(1, t / 22)) + t * 0.6;
				const s = size * (0.4 + hash(i * 3.3) * 0.9);
				return (
					<rect
						key={i}
						x={cx + Math.cos(a) * d - s / 2}
						y={cy + Math.sin(a) * d - s / 2 + t * 0.4}
						width={s}
						height={s * (hash(i) > 0.6 ? 1 : 0.55)}
						rx={s / 3}
						fill={colors[i % colors.length]}
						opacity={(1 - p) * (0.5 + hash(i * 9) * 0.5)}
						transform={`rotate(${hash(i) * 180 + t * 4} ${cx + Math.cos(a) * d} ${cy + Math.sin(a) * d})`}
					/>
				);
			})}
		</svg>
	);
};

// Thin expanding ring(s).
export const Rings: React.FC<{start: number; color?: string; n?: number; max?: number; dur?: number; width?: number; cx?: number; cy?: number}> = ({
	start,
	color = C.accent,
	n = 2,
	max = 820,
	dur = 26,
	width = 2,
	cx = 960,
	cy = 540,
}) => {
	const f = useCurrentFrame();
	return (
		<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
			{Array.from({length: n}, (_, i) => {
				const t = (f - start - i * 3) / dur;
				if (t < 0 || t > 1) return null;
				return <circle key={i} cx={cx} cy={cy} r={60 + EASE.out(t) * max * (1 - i * 0.18)} fill="none" stroke={color} strokeWidth={width} opacity={(1 - t) * 0.7} />;
			})}
		</svg>
	);
};

// ---------- UI atoms (light scenes) ----------

export const card: React.CSSProperties = {
	background: C.card,
	borderRadius: 18,
	boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 6px rgba(15,22,36,0.06), 0 24px 60px -18px rgba(15,22,36,0.22)',
	border: '1px solid rgba(10,13,20,0.06)',
};

export const darkCard: React.CSSProperties = {
	background: 'linear-gradient(180deg, #12151F 0%, #0B0E16 100%)',
	borderRadius: 18,
	border: '1px solid rgba(255,255,255,0.09)',
	boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.4)',
};

export const Skel: React.FC<{w: number | string; h?: number; c?: string; style?: React.CSSProperties}> = ({w, h = 10, c = 'rgba(10,13,20,0.07)', style}) => (
	<div style={{width: w, height: h, borderRadius: h / 2, background: c, ...style}} />
);

export const Avatar: React.FC<{size?: number; bg?: string; label?: string}> = ({size = 34, bg = C.ink, label = 'B'}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			background: bg,
			color: '#fff',
			fontFamily: F.display,
			fontWeight: 800,
			fontSize: size * 0.42,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
		}}
	>
		{label}
	</div>
);

// Mouse pointer.
export const Pointer: React.FC<{x: number; y: number; press?: number; color?: string}> = ({x, y, press = 0, color = C.ink}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', zIndex: 50}}>
		<svg width="30" height="36" viewBox="0 0 24 30">
			<path d="M2 2 L2 24 L8 18.5 L12 27 L15.5 25.5 L11.6 17.2 L19.5 17.2 Z" fill={color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
		</svg>
	</div>
);
