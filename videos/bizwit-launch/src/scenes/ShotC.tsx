import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, tween} from '../lib/anim';
import {Burst, Mark, Paper, Particles, Rings, Smear, Space, WordmarkDrop} from '../lib/kit';

// C · 120–186 (local 0–66) · black dot → white burst → logo lands, tagline.
// ref: 0–8 black + tiny dot; 9 white flash, rings + ticks + particles; mark 9–14, letters drop 10–20;
// tagline 33; slow push; 60–66 whip left with horizontal smear.
// Wordmark only by default (the BIZ/WIT mark is kept for the opening emblem, never beside the wordmark).
export const LogoLockup: React.FC<{start: number; color?: string; h?: number; mark?: boolean}> = ({start, color = C.ink, h = 150, mark = false}) => {
	const f = useCurrentFrame();
	const mp = interpolate(f, [start, start + 4, start + 8], [0.4, 1.12, 1], clamp);
	const mrot = tween(f, [start, start + 8], [-18, 0]);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: h * 0.38}}>
			{mark && <div style={{opacity: f < start ? 0 : 1, transform: `scale(${mp}) rotate(${mrot}deg)`, filter: f < start + 5 ? `blur(${(start + 5 - f) * 2}px)` : undefined}}>
				<Mark size={h * 1.22} color={color} />
			</div>}
			<WordmarkDrop height={h} start={start + 1} color={color} />
		</div>
	);
};

export const ShotC: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const B = 3; // burst frame
	if (f < B) {
		return (
			<AbsoluteFill>
				<Space />
				<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
					<circle cx={960} cy={540} r={5 + f * 0.4} fill={C.accent2} />
					<circle cx={960} cy={540} r={16} fill={C.accent} opacity={0.25} />
				</svg>
			</AbsoluteFill>
		);
	}
	const push = interpolate(f, [B, dur], [1.04, 1.0], clamp);
	const lift = tween(f, [26, 36], [0, -38], EASE.inOut);
	const whip = tween(f, [dur - 6, dur], [0, 1], EASE.in);
	return (
		<AbsoluteFill>
			<Paper glow={1} />
			<AbsoluteFill style={{background: '#fff', opacity: tween(f, [B, B + 5], [0.9, 0])}} />
			<Rings start={B} n={2} max={760} dur={30} color={C.accent} width={2} />
			<Rings start={B + 2} n={1} max={520} dur={40} color="rgba(10,13,20,0.25)" width={1.5} />
			<Burst start={B} color={C.accent} n={30} len={46} reach={760} dur={14} width={4} />
			<Particles start={B} n={54} reach={620} life={58} />
			<Smear dx={-whip * 700} n={whip > 0 ? 8 : 1}>
				<AbsoluteFill style={{transform: `translateX(${-whip * 900}px) scale(${push})`, justifyContent: 'center', alignItems: 'center'}}>
					<div style={{transform: `translateY(${lift}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<LogoLockup start={B + 2} h={170} />
						<div
							style={{
								marginTop: 44,
								fontFamily: F.display,
								fontWeight: 700,
								fontSize: 46,
								letterSpacing: '-0.03em',
								color: C.ink,
								opacity: tween(f, [33, 40], [0, 1]),
								transform: `translateY(${tween(f, [33, 41], [16, 0])}px)`,
								position: 'absolute',
								top: '100%',
								whiteSpace: 'nowrap',
							}}
						>
							ai solutions built for <span style={{color: C.accent}}>real-world operations.</span>
						</div>
					</div>
				</AbsoluteFill>
			</Smear>
		</AbsoluteFill>
	);
};
