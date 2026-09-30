import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../brand';
import {EASE, clamp, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';
import {interpolate} from 'remotion';

// Wrap a scene to give it a slow "camera": push-in, drift, slight rotation. dur = scene length.
export const CameraDrift: React.FC<{dur: number; zoom?: [number, number]; rotate?: [number, number]; pan?: [number, number]; children: React.ReactNode}> = ({dur, zoom = [1.06, 1], rotate = [0, 0], pan = [0, 0], children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [0, dur], [0, 1], EASE.out);
	const z = zoom[0] + (zoom[1] - zoom[0]) * p;
	const r = rotate[0] + (rotate[1] - rotate[0]) * p;
	return <AbsoluteFill style={{transform: `translate(${pan[0] * p * u}px, ${pan[1] * p * u}px) scale(${z}) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

// Depth-of-field layer: z=0 is in focus; |z| blurs and scales. Gentle float drift.
export const DepthLayer: React.FC<{z?: number; x?: number; y?: number; drift?: number; delay?: number; seed?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z = 0, x = 0, y = 0, drift = 14, delay = 0, seed = 1, children, style}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const s = springAt(f, fps, delay, 'smooth');
	const dx = Math.sin((f + seed * 40) / 45) * drift * u;
	const dy = Math.cos((f + seed * 70) / 55) * drift * u;
	return (
		<div style={{position: 'absolute', left: x * u, top: y * u, filter: `blur(${Math.abs(z) * 7 * u}px)`, opacity: s * (1 - Math.min(Math.abs(z) * 0.15, 0.6)), transform: `translate(${dx}px, ${dy + (1 - s) * 40 * u}px) scale(${1 - z * 0.07})`, ...style}}>
			{children}
		</div>
	);
};

// Fibonacci particle sphere that assembles from a scatter and rotates.
export const ParticleSphere: React.FC<{count?: number; radius?: number; colors?: string[]; start?: number; speed?: number; dot?: number}> = ({count = 700, radius = 340, colors = [C.text, C.text, C.text, C.accent, C.accent2], start = 0, speed = 1, dot = 3}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {w, h, u} = useLayout();
	const t = springAt(f, fps, start, 'heavy');
	const ry = f * 0.02 * speed;
	const rx = 0.35;
	const R = radius * u;
	const pts = [];
	for (let i = 0; i < count; i++) {
		const yy = 1 - (i / (count - 1)) * 2;
		const rr = Math.sqrt(1 - yy * yy);
		const th = i * Math.PI * (3 - Math.sqrt(5));
		const tx = Math.cos(th) * rr * R;
		const ty = yy * R;
		const tz = Math.sin(th) * rr * R;
		const sx = (random(`sx${i}`) - 0.5) * w * 1.4;
		const sy = (random(`sy${i}`) - 0.5) * h * 1.4;
		const sz = (random(`sz${i}`) - 0.5) * R * 3;
		const x = sx + (tx - sx) * t;
		const y = sy + (ty - sy) * t;
		const z = sz + (tz - sz) * t;
		const x1 = x * Math.cos(ry) + z * Math.sin(ry);
		const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
		const y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
		const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
		const k = 1200 * u / (1200 * u + z2);
		pts.push({x: w / 2 + x1 * k, y: h / 2 + y1 * k, r: Math.max(0.6, dot * k * u), o: interpolate(z2, [-R, R], [1, 0.25], clamp), z: z2, c: colors[Math.floor(random(`c${i}`) * colors.length)], i});
	}
	pts.sort((a, b) => b.z - a.z);
	return (
		<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
			{pts.map((p) => <circle key={p.i} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={p.o} />)}
		</svg>
	);
};

// Elliptical orbits with glowing dots + trails (identity / logo scenes).
export const Orbit: React.FC<{rx?: number; ry?: number; rotate?: number; colors?: string[]; speed?: number; start?: number; line?: string}> = ({rx = 720, ry = 170, rotate = -8, colors = [C.accent, C.accent3, C.accent2], speed = 1, start = 0, line = 'rgba(255,255,255,0.22)'}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	const draw = tween(f, [start, start + 40], [1, 0], EASE.out);
	const cx = w / 2;
	const cy = h / 2;
	const rot = (rotate * Math.PI) / 180;
	const pt = (a: number) => {
		const x = Math.cos(a) * rx * u;
		const y = Math.sin(a) * ry * u;
		return {x: cx + x * Math.cos(rot) - y * Math.sin(rot), y: cy + x * Math.sin(rot) + y * Math.cos(rot)};
	};
	return (
		<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
			<ellipse cx={cx} cy={cy} rx={rx * u} ry={ry * u} transform={`rotate(${rotate} ${cx} ${cy})`} fill="none" stroke={line} strokeWidth={1.5 * u} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
			{colors.map((col, i) => {
				const a = f * 0.045 * speed + i * ((2 * Math.PI) / colors.length);
				return [0, 1, 2, 3, 4].map((k) => {
					const p = pt(a - k * 0.03);
					return <circle key={`${i}-${k}`} cx={p.x} cy={p.y} r={(9 - k * 1.6) * u} fill={col} opacity={(1 - k * 0.2) * (1 - draw)} />;
				});
			})}
		</svg>
	);
};

// Concentric rings pulsing outward (intros, sonar, "signal" moments).
export const RingPulse: React.FC<{count?: number; color?: string; period?: number; maxR?: number; width?: number; fill?: boolean}> = ({count = 5, color = C.text, period = 60, maxR = 900, width = 2, fill = false}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	return (
		<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: count}).map((_, i) => {
				const p = ((f / period + i / count) % 1 + 1) % 1;
				return <circle key={i} cx={w / 2} cy={h / 2} r={p * maxR * u} fill="none" stroke={color} strokeWidth={fill ? 40 * u * (1 - p) : width * u} opacity={(1 - p) * 0.8} />;
			})}
		</svg>
	);
};

// Grid of rounded tiles popping from centre, then a colour-flip wave.
export const TileGrid: React.FC<{cols?: number; rows?: number; colors?: string[]; start?: number; waveAt?: number; cell?: number; gap?: number; radius?: number}> = ({
	cols = 14, rows = 7, colors = [C.text, C.text, C.text, C.accent, C.accent2, C.accent3], start = 0, waveAt = 45, cell = 84, gap = 28, radius = 12,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {w, h, u} = useLayout();
	const step = (cell + gap) * u;
	const W = cols * step;
	const H = rows * step;
	const cells = [];
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			const d = Math.hypot(c - (cols - 1) / 2, r - (rows - 1) / 2);
			const pop = springAt(f, fps, start + d * 2.2, 'bouncy');
			const flip = tween(f - waveAt - c * 2.5 - r * 0.8, [0, 12], [0, 180], EASE.inOut);
			const col = colors[Math.floor((flip > 90 ? random(`b${i}`) : random(`a${i}`)) * colors.length)];
			cells.push(<div key={i} style={{position: 'absolute', left: c * step + (gap * u) / 2, top: r * step + (gap * u) / 2, width: cell * u, height: cell * u, borderRadius: radius * u, background: col, transform: `scale(${pop}) rotateY(${flip}deg)`}} />);
		}
	return (
		<div style={{position: 'absolute', left: (w - W) / 2, top: (h - H) / 2, width: W, height: H, perspective: 1400 * u}}>{cells}</div>
	);
};

// Iridescent glass orb (pure CSS) — "depth" / premium 3D feel without a 3D engine.
export const GlassOrb: React.FC<{size?: number; x?: number; y?: number; hue?: number; float?: number; seed?: number}> = ({size = 260, x = 0, y = 0, hue = 260, float = 20, seed = 0}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const s = size * u;
	const dy = Math.sin((f + seed * 30) / 40) * float * u;
	return (
		<div
			style={{
				position: 'absolute', left: x * u - s / 2, top: y * u - s / 2 + dy, width: s, height: s, borderRadius: '50%',
				background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 14%),
					radial-gradient(circle at 70% 75%, hsla(${hue + 60},95%,65%,0.9) 0%, hsla(${hue + 60},95%,65%,0) 40%),
					radial-gradient(circle at 25% 70%, hsla(${hue - 40},95%,60%,0.85) 0%, hsla(${hue - 40},95%,60%,0) 45%),
					radial-gradient(circle at 50% 50%, hsl(${hue},60%,30%) 0%, hsl(${hue},70%,12%) 100%)`,
				boxShadow: `inset 0 0 ${s * 0.15}px rgba(255,255,255,0.35), 0 ${s * 0.15}px ${s * 0.35}px rgba(0,0,0,0.45)`,
			}}
		/>
	);
};

// Rotating 3D-ish glass cube (CSS 3D). Good for "neon glass SaaS" looks.
export const GlassCube: React.FC<{size?: number; color?: string; speed?: number}> = ({size = 320, color = C.accent2, speed = 1}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const s = size * u;
	const faces = [
		`rotateY(0deg) translateZ(${s / 2}px)`, `rotateY(90deg) translateZ(${s / 2}px)`, `rotateY(180deg) translateZ(${s / 2}px)`,
		`rotateY(-90deg) translateZ(${s / 2}px)`, `rotateX(90deg) translateZ(${s / 2}px)`, `rotateX(-90deg) translateZ(${s / 2}px)`,
	];
	return (
		<div style={{width: s, height: s, perspective: 1600 * u}}>
			<div style={{position: 'relative', width: s, height: s, transformStyle: 'preserve-3d', transform: `rotateX(${-22 + Math.sin(f / 50) * 6}deg) rotateY(${f * 0.8 * speed}deg)`}}>
				{faces.map((t, i) => (
					<div key={i} style={{position: 'absolute', inset: 0, transform: t, background: `linear-gradient(135deg, ${color}66, ${color}14)`, border: `${2 * u}px solid ${color}cc`, boxShadow: `inset 0 0 ${40 * u}px ${color}88, 0 0 ${30 * u}px ${color}55`, borderRadius: 10 * u}} />
				))}
			</div>
		</div>
	);
};
