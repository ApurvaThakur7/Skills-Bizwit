import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {EASE, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

// Scene wrappers: put around a scene's content. `dur` = scene length (for exits).
// Tip: for cross-scene transitions you can also use @remotion/transitions (see cookbook).

// Enter by zooming from slightly large + blurred (punchy default cut-in).
export const ZoomIn: React.FC<{frames?: number; from?: number; blur?: number; children: React.ReactNode}> = ({frames = 14, from = 1.18, blur = 14, children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [0, frames], [0, 1], EASE.out);
	return <AbsoluteFill style={{transform: `scale(${from + (1 - from) * p})`, filter: p < 1 ? `blur(${(1 - p) * blur * u}px)` : undefined, opacity: Math.min(1, p * 2)}}>{children}</AbsoluteFill>;
};

// Exit by zooming through the camera (use on the last ~10 frames of a scene).
export const ZoomOut: React.FC<{dur: number; frames?: number; to?: number; children: React.ReactNode}> = ({dur, frames = 10, to = 1.5, children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [dur - frames, dur], [0, 1], EASE.in);
	return <AbsoluteFill style={{transform: `scale(${1 + (to - 1) * p})`, filter: p > 0 ? `blur(${p * 18 * u}px)` : undefined, opacity: 1 - p}}>{children}</AbsoluteFill>;
};

// Whip pan in from a side with motion blur.
export const WhipIn: React.FC<{frames?: number; dir?: 'left' | 'right' | 'up' | 'down'; children: React.ReactNode}> = ({frames = 12, dir = 'right', children}) => {
	const f = useCurrentFrame();
	const {w, h, u} = useLayout();
	const p = tween(f, [0, frames], [0, 1], EASE.out);
	const d = 1 - p;
	const t = {left: `translateX(${-d * w * 0.6}px)`, right: `translateX(${d * w * 0.6}px)`, up: `translateY(${-d * h * 0.6}px)`, down: `translateY(${d * h * 0.6}px)`}[dir];
	return <AbsoluteFill style={{transform: t, filter: d > 0.02 ? `blur(${d * 30 * u}px)` : undefined}}>{children}</AbsoluteFill>;
};

// Fade (+ optional slight rise) — calm/editorial styles.
export const FadeIn: React.FC<{frames?: number; rise?: number; children: React.ReactNode}> = ({frames = 12, rise = 0, children}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [0, frames], [0, 1], EASE.out);
	return <AbsoluteFill style={{opacity: p, transform: `translateY(${(1 - p) * rise * u}px)`}}>{children}</AbsoluteFill>;
};

// Overlay: quick flash at scene start (use on beat cuts). Place as last child of a scene.
export const Flash: React.FC<{color?: string; frames?: number; strength?: number}> = ({color = '#FFFFFF', frames = 5, strength = 0.6}) => {
	const f = useCurrentFrame();
	const o = tween(f, [0, frames], [strength, 0]);
	return o > 0 ? <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} /> : null;
};

// Overlay: a colour panel sweeps across to cover, then reveals (brand wipe). Place at scene end or start.
export const Wipe: React.FC<{at: number; frames?: number; color?: string; dir?: 'left' | 'right' | 'up' | 'down'}> = ({at, frames = 16, color = C.accent, dir = 'right'}) => {
	const f = useCurrentFrame();
	const p = tween(f, [at, at + frames], [0, 1], EASE.inOut);
	if (p <= 0 || p >= 1) return null;
	const a = p < 0.5 ? 0 : (p - 0.5) * 2 * 100; // trailing edge
	const b = p < 0.5 ? p * 2 * 100 : 100; // leading edge
	const clip = {
		right: `inset(0 ${100 - b}% 0 ${a}%)`,
		left: `inset(0 ${a}% 0 ${100 - b}%)`,
		down: `inset(${a}% 0 ${100 - b}% 0)`,
		up: `inset(${100 - b}% 0 ${a}% 0)`,
	}[dir];
	return <AbsoluteFill style={{background: color, clipPath: clip}} />;
};

// Circle iris reveal of the scene (centre out).
export const IrisIn: React.FC<{frames?: number; x?: number; y?: number; children: React.ReactNode}> = ({frames = 18, x = 50, y = 50, children}) => {
	const f = useCurrentFrame();
	const p = tween(f, [0, frames], [0, 1], EASE.inOut);
	return <AbsoluteFill style={{clipPath: p < 1 ? `circle(${p * 75}% at ${x}% ${y}%)` : undefined}}>{children}</AbsoluteFill>;
};
