import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Easing vocabulary. Premium motion = fast-out/slow-settle, never linear (except loops/scroll).
export const EASE = {
	out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out: default for entrances
	inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera moves, morphs, position swaps
	in: Easing.bezier(0.7, 0, 0.84, 0), // exits, zoom-throughs
	snap: Easing.bezier(0.2, 0.9, 0.1, 1), // UI snaps, toggles
	back: Easing.bezier(0.34, 1.56, 0.64, 1), // small overshoot for pops
	linear: Easing.linear,
};

export const SPRING = {
	smooth: {damping: 200}, // no bounce
	snappy: {damping: 20, stiffness: 200}, // UI, cards
	bouncy: {damping: 10, stiffness: 120}, // playful pops
	heavy: {damping: 15, stiffness: 80, mass: 2}, // big type, logos
	slam: {damping: 14, stiffness: 180}, // kinetic words
} as const;
export type SpringName = keyof typeof SPRING;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Interpolate with clamping + easing in one call.
export const tween = (frame: number, [a, b]: [number, number], [from, to]: [number, number], ease = EASE.out) =>
	interpolate(frame, [a, b], [from, to], {...clamp, easing: ease});

// Spring progress 0→1 starting at `delay` frames.
export const useSpring = (delay = 0, preset: SpringName = 'snappy', durationInFrames?: number) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: f - delay, fps, config: SPRING[preset], durationInFrames});
};
export const springAt = (frame: number, fps: number, delay = 0, preset: SpringName = 'snappy') =>
	spring({frame: frame - delay, fps, config: SPRING[preset]});

// Seconds → frames.
export const useSec = () => {
	const {fps} = useVideoConfig();
	return (s: number) => Math.round(s * fps);
};

// Frames of a beat at a given BPM (for cutting to music).
export const beatFrames = (bpm: number, fps: number) => (60 / bpm) * fps;

// Entrance + exit envelope: fades in over `inDur`, out over `outDur` before `end`.
export const envelope = (f: number, start: number, end: number, inDur = 10, outDur = 10) =>
	Math.min(tween(f, [start, start + inDur], [0, 1]), tween(f, [end - outDur, end], [1, 0], EASE.in));

// Deterministic pseudo-random in [0,1) (use remotion's random() for seeded strings).
export const hash = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
