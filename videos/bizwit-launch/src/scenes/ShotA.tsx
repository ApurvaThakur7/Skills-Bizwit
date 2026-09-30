import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {EASE, clamp, hash, tween} from '../lib/anim';
import {Mark, Orb, Space} from '../lib/kit';

// A · 0–60 · emblem assembles on black.
// ref: ring (0–3) → particle burst (3–9) → dot (9–20) → dot stretches into pole (22–28) → flag unfurls (36–40)
//      → white mountain pops with ring flash (52–58) → whip-down smear into the orange slide.
// ours: ring → burst → dot → pole = the stem of the "B" → BIZ half wipes out of the stem (blue) → full white mark pops.
export const ShotA: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const cx = 960;
	const cy = 540;
	const orbPulse = 0.75 + 0.25 * tween(f, [0, 12], [0, 1]) + (f >= 48 ? 0.35 * tween(f, [48, 58], [1, 0]) : 0);

	// ring logo
	const ringOp = tween(f, [0, 2], [1, 1]) * tween(f, [3, 7], [1, 0]);
	const ringR = interpolate(f, [0, 3, 7], [40, 48, 120], clamp);
	// dot
	const dotOp = tween(f, [6, 10], [0, 1]) * (f < 13 ? 1 : 0);
	const dotR = 16 + 3 * Math.sin(f / 2.5) * tween(f, [10, 20], [1, 0]);
	// pole: stretches up from the dot (overshoot)
	const poleP = interpolate(f, [13, 16, 19], [0, 1.18, 1], clamp);
	const poleOn = f >= 13 && f < 48;
	const MS = 400; // mark size (ref emblem ≈ 38% of width at the pop)
	const markX = cx - MS / 2;
	const markY = cy - MS / 2 - 10;
	// BIZ half reveal (flag unfurl equivalent) 34–44, WIT half 44–50
	const topReveal = tween(f, [30, 37], [0, 1], EASE.out);
	const botReveal = tween(f, [38, 45], [0, 1], EASE.out);
	// final pop
	const pop = interpolate(f, [48, 51, 54], [0.86, 1.06, 1], clamp);
	const white = f >= 48;
	// whip-down smear at the end
	const whip = tween(f, [51, 60], [0, 1], EASE.inOut);

	return (
		<AbsoluteFill>
			<Space />
			<Orb size={1250} strength={orbPulse} />
			<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
				{/* faint outer circle like the reference */}
				<circle cx={cx} cy={cy} r={interpolate(f, [4, 14], [200, 330], clamp)} fill="none" stroke={C.accent} strokeWidth={1.5} opacity={tween(f, [4, 8], [0, 0.45]) * tween(f, [30, 50], [1, 0.25])} />
				{ringOp > 0 && (
					<>
						<circle cx={cx} cy={cy} r={ringR} fill="none" stroke={C.accent} strokeWidth={11} opacity={ringOp} />
						<circle cx={cx} cy={cy} r={ringR * 0.45} fill={C.accent} opacity={ringOp} />
						{f >= 3 && <circle cx={cx} cy={cy} r={ringR + 12} fill="none" stroke={C.accent} strokeWidth={3} opacity={ringOp * 0.6} />}
					</>
				)}
				{/* burst particles 3–20 */}
				{f >= 3 &&
					f < 24 &&
					Array.from({length: 14}, (_, i) => {
						const a = (i / 14) * Math.PI * 2 + hash(i) * 0.4;
						const t = f - 3;
						const d = 30 + EASE.out(Math.min(1, t / 8)) * (90 + hash(i + 2) * 110) - Math.max(0, t - 8) * 7;
						return <circle key={i} cx={cx + Math.cos(a) * Math.max(0, d)} cy={cy + Math.sin(a) * Math.max(0, d)} r={4 + hash(i) * 4} fill={C.accent2} opacity={tween(f, [14, 22], [1, 0])} />;
					})}
				{dotOp > 0 && <circle cx={cx} cy={cy} r={dotR * 1.9} fill={C.accent} opacity={dotOp} />}
				{/* sparks at pole tip */}
				{f >= 14 &&
					f < 20 &&
					Array.from({length: 7}, (_, i) => {
						const a = -Math.PI / 2 + (i - 3) * 0.35;
						const r = 20 + (f - 14) * 16;
						const tx = cx;
						const ty = markY - 6;
						return <line key={i} x1={tx + Math.cos(a) * r} y1={ty + Math.sin(a) * r} x2={tx + Math.cos(a) * (r + 18)} y2={ty + Math.sin(a) * (r + 18)} stroke={C.accent2} strokeWidth={3} strokeLinecap="round" opacity={1 - (f - 14) / 6} />;
					})}
			</svg>

			{/* pole = the B stem, grows from the dot */}
			{poleOn && (
				<div
					style={{
						position: 'absolute',
						left: cx - 36,
						top: markY,
						width: 72,
						height: MS * 1.0,
						borderRadius: 36,
						background: C.accent,
						transformOrigin: '50% 100%',
						transform: `scaleY(${poleP}) translateY(${(1 - poleP) * 140}px)`,
						opacity: topReveal > 0.6 ? 0 : 1,
						boxShadow: `0 0 30px ${C.accent}`,
					}}
				/>
			)}

			{/* the mark: revealed out of the stem, top half then bottom half (blue) → pops white */}
			{f >= 30 && (
				<div
					style={{
						position: 'absolute',
						left: markX,
						top: markY,
						transform: `translate(${-whip * 260}px, ${whip * 520}px) rotate(${-whip * 14}deg) scale(${pop * (1 + whip * 2.4)}, ${pop * (1 + whip * 4.2)})`,
						transformOrigin: '50% 30%',
						filter: whip > 0 ? `blur(${whip * 14}px)` : `drop-shadow(0 0 ${white ? 26 : 18}px rgba(0,157,255,${white ? 0.65 : 0.8}))`,
						opacity: 1 - whip * 0.3,
					}}
				>
					<div style={{clipPath: `inset(0 ${(1 - topReveal) * 50}% ${white ? 0 : 50}% ${(1 - topReveal) * 50}%)`}}>
						<Mark size={MS} color={white ? '#FFFFFF' : C.accent} />
					</div>
					{!white && (
						<div style={{position: 'absolute', inset: 0, clipPath: `inset(50% ${(1 - botReveal) * 50}% 0 ${(1 - botReveal) * 50}%)`}}>
							<Mark size={MS} color={C.accent2} />
						</div>
					)}
				</div>
			)}
			{/* ring flash on pop */}
			{f >= 48 && (
				<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
					<circle cx={cx} cy={cy} r={interpolate(f, [48, 58], [260, 420], clamp)} fill="none" stroke="#fff" strokeWidth={2} opacity={tween(f, [48, 58], [0.8, 0])} />
				</svg>
			)}
		</AbsoluteFill>
	);
};
