import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {C, F} from '../brand';
import {EASE, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

// "Launch-film" moves seen in top Opus reels (ClimbX etc.): real motion blur, chromatic text slams,
// directional whips, 3D flying/stacked cards, glowing charts, particle-converge logo builds.

// Real camera motion blur (renders `samples` sub-frames). Wrap only the moving part/scene — costly.
export const MotionBlur: React.FC<{samples?: number; shutter?: number; children: React.ReactNode}> = ({samples = 6, shutter = 200, children}) => (
	<CameraMotionBlur samples={samples} shutterAngle={shutter}>
		{children}
	</CameraMotionBlur>
);

// Directional (motion-style) blur via an SVG filter: bx = horizontal px, by = vertical px.
let dirId = 0;
export const DirBlur: React.FC<{bx?: number; by?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({bx = 0, by = 0, children, style}) => {
	const [id] = React.useState(() => `dirblur${dirId++}`);
	const on = bx > 0.3 || by > 0.3;
	return (
		<>
			{on ? (
				<svg width={0} height={0} style={{position: 'absolute'}}>
					<filter id={id} x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation={`${bx} ${by}`} />
					</filter>
				</svg>
			) : null}
			<AbsoluteFill style={{filter: on ? `url(#${id})` : undefined, ...style}}>{children}</AbsoluteFill>
		</>
	);
};

// Scene enter: whip from a direction with directional blur. frames ≈ 8–12.
export const WhipBlurIn: React.FC<{frames?: number; dir?: 'left' | 'right' | 'up' | 'down'; distance?: number; children: React.ReactNode}> = ({frames = 10, dir = 'right', distance = 0.5, children}) => {
	const f = useCurrentFrame();
	const {w, h} = useLayout();
	const p = tween(f, [0, frames], [0, 1], EASE.out);
	const d = 1 - p;
	const horiz = dir === 'left' || dir === 'right';
	const sign = dir === 'right' || dir === 'down' ? 1 : -1;
	const off = sign * d * (horiz ? w : h) * distance;
	return (
		<DirBlur bx={horiz ? d * 60 : 0} by={horiz ? 0 : d * 60} style={{transform: horiz ? `translateX(${off}px)` : `translateY(${off}px)`}}>
			{children}
		</DirBlur>
	);
};

// Scene exit (last `frames` of a scene of length `dur`): whip away with directional blur.
export const WhipBlurOut: React.FC<{dur: number; frames?: number; dir?: 'left' | 'right' | 'up' | 'down'; children: React.ReactNode}> = ({dur, frames = 8, dir = 'left', children}) => {
	const f = useCurrentFrame();
	const {w, h} = useLayout();
	const p = tween(f, [dur - frames, dur], [0, 1], EASE.in);
	const horiz = dir === 'left' || dir === 'right';
	const sign = dir === 'right' || dir === 'down' ? 1 : -1;
	const off = sign * p * (horiz ? w : h) * 0.5;
	return (
		<DirBlur bx={horiz ? p * 70 : 0} by={horiz ? 0 : p * 70} style={{transform: horiz ? `translateX(${off}px)` : `translateY(${off}px)`, opacity: 1 - p * 0.6}}>
			{children}
		</DirBlur>
	);
};

// Zoom-through exit: scene scales toward camera and blurs out (pairs with ZoomIn on the next scene).
export const ZoomThrough: React.FC<{dur: number; frames?: number; to?: number; children: React.ReactNode}> = ({dur, frames = 10, to = 2.8, children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [dur - frames, dur], [0, 1], EASE.in);
	return <AbsoluteFill style={{transform: `scale(${1 + (to - 1) * p})`, filter: p > 0 ? `blur(${p * 30 * u}px)` : undefined, opacity: 1 - p * p}}>{children}</AbsoluteFill>;
};

// Words slam in one by one: overshoot scale, blur→sharp, RGB (chromatic) split that converges.
export const ChromaticSlam: React.FC<{
	text: string; start?: number; stagger?: number; size?: number; weight?: number; font?: string; color?: string;
	highlight?: string[]; highlightColor?: string; highlightFont?: string; italicHighlight?: boolean; align?: 'left' | 'center';
	split?: number; lowercase?: boolean; letterSpacing?: number; style?: React.CSSProperties;
}> = ({text, start = 0, stagger = 5, size = 150, weight = 800, font = F.display, color = C.text, highlight = [], highlightColor = C.accent,
	highlightFont, italicHighlight = false, align = 'center', split = 26, lowercase = false, letterSpacing = -0.045, style}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u, w} = useLayout();
	const hl = highlight.map((x) => x.toLowerCase());
	// auto-fit: the longest line must fit in 84% of the frame width
	const longest = Math.max(...text.split('\n').map((l) => l.length));
	size = Math.min(size, (w * 0.84) / u / Math.max(1, longest * 0.56));
	let i = 0;
	return (
		<div style={{fontFamily: font, fontWeight: weight, fontSize: size * u, lineHeight: 1.02, letterSpacing: `${letterSpacing}em`, textAlign: align, color, ...style}}>
			{text.split('\n').map((line, li) => (
				<div key={li} style={{whiteSpace: 'nowrap'}}>
					{line.split(' ').map((word, wi) => {
						const idx = i++;
						const local = f - start - idx * stagger;
						const s = springAt(f, fps, start + idx * stagger, 'slam');
						const blur = tween(local, [0, 7], [18, 0]);
						const k = tween(local, [0, 9], [1, 0]) * split * u;
						const isH = hl.includes(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''));
						const col = isH ? highlightColor : color;
						const ws: React.CSSProperties = {display: 'inline-block', position: 'relative', marginRight: '0.24em', opacity: local < 0 ? 0 : Math.min(1, local / 3 + 0.2),
							transform: `scale(${1.5 - 0.5 * s})`, filter: blur > 0.2 ? `blur(${blur * u}px)` : undefined,
							fontFamily: isH && highlightFont ? highlightFont : undefined, fontStyle: isH && italicHighlight ? 'italic' : undefined, color: col};
						const w = lowercase ? word.toLowerCase() : word;
						return (
							<span key={wi} style={ws}>
								{k > 0.5 ? <span style={{position: 'absolute', left: -k, top: 0, color: '#FF2D55', mixBlendMode: 'screen', opacity: 0.8}}>{w}</span> : null}
								{k > 0.5 ? <span style={{position: 'absolute', left: k, top: 0, color: '#00E5FF', mixBlendMode: 'screen', opacity: 0.8}}>{w}</span> : null}
								<span style={{position: 'relative'}}>{w}</span>
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

// Cards scattered in 3D space drifting toward/around the camera, depth-blurred ("what do I post?" chaos).
// renderCard(i) returns the card content; cards are width×height (px @1080).
export const FlyingCards: React.FC<{count?: number; renderCard: (i: number) => React.ReactNode; width?: number; height?: number; speed?: number; start?: number; spread?: number; seed?: string}> = ({
	count = 18, renderCard, width = 300, height = 110, speed = 1, start = 0, spread = 1, seed = 'fc',
}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	const t = Math.max(0, f - start);
	return (
		<AbsoluteFill style={{perspective: 1100 * u, overflow: 'hidden'}}>
			{Array.from({length: count}).map((_, i) => {
				const rx = random(`${seed}x${i}`) - 0.5;
				const ry = random(`${seed}y${i}`) - 0.5;
				const z0 = -1400 + random(`${seed}z${i}`) * 1500;
				const z = z0 + t * 9 * speed * (0.6 + random(`${seed}s${i}`) * 0.8);
				const zz = ((z + 1400) % 1700) - 1400; // loop cards back to the far plane
				const near = tween(zz, [150, 290], [1, 0], EASE.linear);
				const appear = tween(t - i * 1.2, [0, 12], [0, 1]);
				const blur = Math.abs(zz + 250) / 110;
				return (
					<div key={i} style={{position: 'absolute', left: w / 2 + rx * w * 1.25 * spread - (width * u) / 2, top: h / 2 + ry * h * 1.2 * spread - (height * u) / 2, width: width * u, height: height * u,
						transform: `translateZ(${zz * u}px) rotateY(${rx * 30}deg) rotateX(${-ry * 20}deg) rotateZ(${(random(`${seed}r${i}`) - 0.5) * 10}deg)`,
						filter: `blur(${Math.min(blur, 10) * u}px)`, opacity: appear * near}}>
						{renderCard(i)}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

// Cards fanned out in a perspective stack, springing apart then settling (feature showcase).
export const CardStack3D: React.FC<{cards: React.ReactNode[]; start?: number; width?: number; height?: number; gap?: number; tilt?: number; x?: number; y?: number}> = ({
	cards, start = 0, width = 760, height = 250, gap = 90, tilt = -24, x = 0, y = 0,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	return (
		<div style={{position: 'absolute', left: `calc(50% + ${x * u}px)`, top: `calc(50% + ${y * u}px)`, perspective: 1600 * u, transformStyle: 'preserve-3d'}}>
			<div style={{transformStyle: 'preserve-3d', transform: `rotateY(${tilt + Math.sin(f / 60) * 3}deg) rotateX(12deg)`}}>
				{cards.map((c, i) => {
					const s = springAt(f, fps, start + i * 4, 'snappy');
					const k = cards.length - 1 - i;
					return (
						<div key={i} style={{position: 'absolute', width: width * u, height: height * u, left: (-width / 2) * u, top: (-height / 2) * u,
							transform: `translate3d(${k * gap * 0.5 * s * u}px, ${-k * gap * 0.35 * s * u}px, ${-k * gap * s * u}px)`,
							opacity: Math.min(1, s * 1.5) * (1 - k * 0.12), filter: k > 0 ? `blur(${k * 0.8 * u}px)` : undefined}}>
							{c}
						</div>
					);
				})}
			</div>
		</div>
	);
};

// Big glowing line chart with a bright moving head + label (dark "growth" slide).
export const GlowLineChart: React.FC<{values: number[]; start?: number; dur?: number; width?: number; height?: number; color?: string; label?: string; strokeWidth?: number}> = ({
	values, start = 0, dur = 50, width = 1500, height = 560, color = C.accent, label, strokeWidth = 7,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + dur], [0, 1], EASE.inOut);
	const max = Math.max(...values);
	const min = Math.min(...values);
	const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - ((v - min) / (max - min || 1)) * height * 0.9 - height * 0.05]);
	const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
	const seg = p * (pts.length - 1);
	const i0 = Math.min(pts.length - 2, Math.floor(seg));
	const fr = seg - i0;
	const hx = pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * fr;
	const hy = pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * fr;
	const gid = `glc${color.replace('#', '')}`;
	return (
		<svg width={width * u} height={height * u} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={gid} x1="0" x2="1">
					<stop offset="0" stopColor={color} stopOpacity={0.15} />
					<stop offset="1" stopColor={color} stopOpacity={1} />
				</linearGradient>
				<filter id={`${gid}g`} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="10" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter={`url(#${gid}g)`} />
			{p > 0.01 ? (
				<>
					<circle cx={hx} cy={hy} r={28} fill={color} opacity={0.25} />
					<circle cx={hx} cy={hy} r={11} fill="#fff" filter={`url(#${gid}g)`} />
					{label ? <text x={hx + 26} y={hy + 7} fill="#fff" fontFamily={F.mono} fontSize={22} letterSpacing={3}>{label}</text> : null}
				</>
			) : null}
		</svg>
	);
};

// Particles fly in from everywhere and converge on the centre, then a burst ring — put a Logo on top.
export const ParticleConverge: React.FC<{count?: number; colors?: string[]; start?: number; dur?: number; radius?: number}> = ({count = 90, colors = [C.accent, C.text, C.accent2], start = 0, dur = 24, radius = 140}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	const p = tween(f, [start, start + dur], [0, 1], EASE.inOut);
	const ring = tween(f, [start + dur - 2, start + dur + 18], [0, 1], EASE.out);
	return (
		<AbsoluteFill>
			<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: count}).map((_, i) => {
					const a = random(`pa${i}`) * Math.PI * 2;
					const r0 = (0.6 + random(`pr${i}`) * 0.6) * Math.max(w, h);
					const r1 = radius * u * (0.2 + random(`pe${i}`) * 0.8);
					const r = r0 + (r1 - r0) * p;
					const after = p >= 1 ? tween(f, [start + dur, start + dur + 20], [1, 2.2], EASE.out) : 1;
					return <circle key={i} cx={w / 2 + Math.cos(a) * r * after} cy={h / 2 + Math.sin(a) * r * after} r={(1.5 + random(`ps${i}`) * 3) * u} fill={colors[i % colors.length]} opacity={p >= 1 ? 1 - ring : 0.9} />;
				})}
				{ring > 0 && ring < 1 ? <circle cx={w / 2} cy={h / 2} r={ring * 520 * u} fill="none" stroke={colors[0]} strokeWidth={3 * u * (1 - ring)} opacity={1 - ring} /> : null}
			</svg>
		</AbsoluteFill>
	);
};

// Soft light pool that pulses on beats (fills big empty dark areas with life).
export const BeatGlow: React.FC<{color?: string; beat?: number; x?: number; y?: number; size?: number; strength?: number}> = ({color = C.accent, beat = 15, x = 50, y = 50, size = 1100, strength = 0.35}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const k = 1 - ((f % beat) / beat);
	const s = size * u * (1 + 0.06 * k);
	return <div style={{position: 'absolute', left: `calc(${x}% - ${s / 2}px)`, top: `calc(${y}% - ${s / 2}px)`, width: s, height: s, borderRadius: '50%', background: color, opacity: strength * (0.7 + 0.3 * k), filter: `blur(${s * 0.22}px)`}} />;
};
