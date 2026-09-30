import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, tween} from '../lib/anim';
import {Burst, Paper, Particles, Rings} from '../lib/kit';
import {LogoLockup} from './ShotC';

// K · 726–900 (local 0–174; ref 24.2–30.0) · end card.
// ref: 0–3 white burst (logo whooshes in large & blurred) + rings, ticks, particles; letters drop 5–18;
// logo rests centred at y≈30%; tagline part 1 types 30, accent part 39; mono credit 60;
// three stat tiles rise 60–66 and count up to 90; URL + pill CTA pop at 90 with a ripple ring; hold to end.
const Count: React.FC<{f: number; start: number; dur: number; render: (p: number) => string}> = ({f, start, dur, render}) => (
	<>{render(interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: EASE.out}))}</>
);

const Tile: React.FC<{i: number; big: React.ReactNode; cap: string}> = ({i, big, cap}) => {
	const f = useCurrentFrame();
	const p = tween(f, [60 + i * 3, 68 + i * 3], [0, 1], EASE.out);
	return (
		<div
			style={{
				width: 400,
				padding: '24px 30px',
				borderRadius: 14,
				background: '#fff',
				boxShadow: '0 2px 6px rgba(15,22,36,0.05), 0 18px 40px -16px rgba(15,22,36,0.2)',
				opacity: p,
				transform: `translateY(${(1 - p) * 30}px)`,
			}}
		>
			<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 60, letterSpacing: '-0.045em', color: C.ink, whiteSpace: 'nowrap'}}>{big}</div>
			<div style={{fontFamily: F.body, fontWeight: 600, fontSize: 21, color: '#8A93A3', marginTop: 4}}>{cap}</div>
		</div>
	);
};

export const ShotK: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const ctaP = interpolate(f, [90, 95, 99], [0, 1.08, 1], clamp);
	const k = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${Math.round(n)}`);
	return (
		<AbsoluteFill>
			<Paper glow={1} />
			<AbsoluteFill style={{background: '#fff', opacity: tween(f, [0, 6], [1, 0])}} />
			<Rings start={0} n={2} max={780} dur={30} />
			<Rings start={2} n={1} max={540} dur={40} color="rgba(10,13,20,0.2)" width={1.5} />
			<Burst start={0} n={30} len={50} reach={780} dur={14} />
			<Particles start={0} n={56} reach={640} life={70} />

			<AbsoluteFill style={{alignItems: 'center'}}>
				<div style={{position: 'absolute', top: 170, transform: `scale(${interpolate(f, [0, 6], [2.4, 1], {...clamp, easing: EASE.out})})`, filter: f < 6 ? `blur(${(6 - f) * 3}px)` : undefined}}>
					<LogoLockup start={3} h={170} mark={false} />
				</div>
				<div style={{position: 'absolute', top: 438, fontFamily: F.display, fontWeight: 700, fontSize: 58, letterSpacing: '-0.035em', whiteSpace: 'nowrap'}}>
					<span style={{color: C.ink, opacity: tween(f, [30, 36], [0, 1]), display: 'inline-block', transform: `translateY(${tween(f, [30, 37], [14, 0])}px)`}}>automate smarter, optimize faster.&nbsp;</span>
					<span style={{color: C.accent, opacity: tween(f, [39, 45], [0, 1]), display: 'inline-block', transform: `translateY(${tween(f, [39, 46], [14, 0])}px)`}}>grow stronger.</span>
				</div>
				<div style={{position: 'absolute', top: 526, fontFamily: F.mono, fontWeight: 500, fontSize: 17, letterSpacing: '0.3em', color: C.accent, opacity: tween(f, [58, 64], [0, 0.9])}}>
					A BIZWIT MARKETING COMPANY · FOUNDED BY PRIYANK SINGH
				</div>
				<div style={{position: 'absolute', top: 580, display: 'flex', gap: 26}}>
					<Tile
						i={0}
						cap="Instagram followers"
						big={
							<>
								0<span style={{color: C.accent}}> → </span>
								<Count f={f} start={62} dur={28} render={(p) => `${k(p * 276000)}${p > 0.99 ? '+' : ''}`} />
							</>
						}
					/>
					<Tile i={1} cap="from kickoff to deployment" big={<Count f={f} start={65} dur={24} render={(p) => `${Math.max(1, Math.round(p * 4))} weeks`} />} />
					<Tile i={2} cap="of support after launch" big={<Count f={f} start={68} dur={24} render={(p) => `${Math.round(p * 60)} days`} />} />
				</div>
				{f >= 90 && (
					<div style={{position: 'absolute', top: 800, display: 'flex', alignItems: 'center', gap: 28, transform: `scale(${ctaP})`}}>
						<div style={{fontFamily: F.display, fontWeight: 800, fontSize: 60, letterSpacing: '-0.04em', color: C.ink}}>
							bizwitai<span style={{color: C.accent}}>.com</span>
						</div>
						<div style={{position: 'relative'}}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 14,
									padding: '16px 18px 16px 34px',
									borderRadius: 999,
									background: C.accent,
									color: '#fff',
									fontFamily: F.body,
									fontWeight: 700,
									fontSize: 30,
									boxShadow: '0 14px 34px -10px rgba(0,128,255,0.7)',
								}}
							>
								Book an AI consultation
								<span style={{width: 44, height: 44, borderRadius: '50%', background: '#fff', color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800}}>→</span>
							</div>
							{f < 115 && (
								<div
									style={{
										position: 'absolute',
										left: '50%',
										top: '50%',
										width: 440,
										height: 440,
										marginLeft: -220,
										marginTop: -220,
										borderRadius: '50%',
										border: `2px solid ${C.accent}`,
										transform: `scale(${tween(f, [90, 115], [0.2, 1.3], EASE.out)})`,
										opacity: tween(f, [90, 115], [0.7, 0]),
									}}
								/>
							)}
						</div>
					</div>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
