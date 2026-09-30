import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {useLayout} from '../lib/layout';

export const Solid: React.FC<{color?: string}> = ({color = C.bg}) => <AbsoluteFill style={{background: color}} />;

// Centre-lit radial gradient: the default "premium dark" canvas.
export const RadialBg: React.FC<{inner?: string; outer?: string; x?: number; y?: number; spread?: number}> = ({inner = '#1C1C26', outer = C.bg, x = 50, y = 45, spread = 70}) => (
	<AbsoluteFill style={{background: `radial-gradient(circle at ${x}% ${y}%, ${inner} 0%, ${outer} ${spread}%)`}} />
);

// Soft drifting colour blobs on a base colour (airy / editorial / SaaS-light looks).
export const GradientBlobs: React.FC<{colors?: string[]; base?: string; blur?: number; speed?: number; opacity?: number; scale?: number}> = ({
	colors = ['#FFC7D1', '#C9DBFF', '#FFE3C2'],
	base = '#FAF8F5',
	blur = 160,
	speed = 1,
	opacity = 0.75,
	scale = 1,
}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	return (
		<AbsoluteFill style={{background: base, overflow: 'hidden'}}>
			{colors.map((c, i) => {
				const t = f * 0.01 * speed + i * 2.1;
				const x = w * (0.5 + 0.32 * Math.sin(t * 0.7 + i * 2.4));
				const y = h * (0.5 + 0.28 * Math.cos(t * 0.55 + i * 1.7));
				const r = Math.max(w, h) * 0.28 * scale * (1 + 0.12 * Math.sin(t * 1.3));
				return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: c, opacity, filter: `blur(${blur * u}px)`}} />;
			})}
		</AbsoluteFill>
	);
};

// Animated film grain. Keep opacity 0.04–0.10; adds analogue richness to flat colour.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
	const f = useCurrentFrame();
	const seed = f % 8;
	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id={`grain${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter={`url(#grain${seed})`} />
			</svg>
		</AbsoluteFill>
	);
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.55, color = '0,0,0'}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(${color},0) 45%, rgba(${color},${strength}) 100%)`, pointerEvents: 'none'}} />
);

// Line grid; `floor` tilts it into a moving perspective floor (launch-film look).
export const GridLines: React.FC<{size?: number; color?: string; opacity?: number; floor?: boolean; speed?: number; thickness?: number}> = ({size = 80, color = C.text, opacity = 0.08, floor = false, speed = 1, thickness = 2}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const s = size * u;
	const off = (f * speed * 2 * u) % s;
	const t = Math.max(1, thickness * u); // ≥2px so lines survive downscaled renders
	const grid: React.CSSProperties = {
		position: 'absolute',
		inset: 0,
		backgroundImage: `linear-gradient(${color} ${t}px, transparent ${t}px), linear-gradient(90deg, ${color} ${t}px, transparent ${t}px)`,
		backgroundSize: `${s}px ${s}px`,
		backgroundPosition: `0 ${off}px`,
		opacity,
	};
	if (!floor) return <AbsoluteFill><div style={grid} /></AbsoluteFill>;
	return (
		// plane hinged at the bottom edge and tilted away → floor receding to a horizon
		<AbsoluteFill style={{perspective: 700 * u, perspectiveOrigin: '50% 30%', overflow: 'hidden'}}>
			<div style={{...grid, inset: undefined, left: '-100%', width: '300%', bottom: 0, height: '130%', transform: 'rotateX(74deg)', transformOrigin: '50% 100%', maskImage: 'linear-gradient(to top, black 10%, transparent 75%)', WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 75%)'}} />
		</AbsoluteFill>
	);
};

// Dot matrix background (tech / stats scenes).
export const DotGrid: React.FC<{gap?: number; color?: string; opacity?: number; dot?: number}> = ({gap = 36, color = C.text, opacity = 0.18, dot = 2}) => {
	const {u} = useLayout();
	return <AbsoluteFill style={{backgroundImage: `radial-gradient(${color} ${dot * u}px, transparent ${dot * u + 0.5}px)`, backgroundSize: `${gap * u}px ${gap * u}px`, opacity}} />;
};

// Soft light pool behind a hero element.
export const Glow: React.FC<{color?: string; size?: number; x?: number; y?: number; opacity?: number}> = ({color = C.accent, size = 900, x = 50, y = 50, opacity = 0.35}) => {
	const {u} = useLayout();
	const s = size * u;
	return <div style={{position: 'absolute', left: `calc(${x}% - ${s / 2}px)`, top: `calc(${y}% - ${s / 2}px)`, width: s, height: s, borderRadius: '50%', background: color, opacity, filter: `blur(${s * 0.25}px)`, pointerEvents: 'none'}} />;
};
