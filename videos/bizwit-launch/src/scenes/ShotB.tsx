import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, hash, tween} from '../lib/anim';
import {SlamLine} from '../lib/kit';

// B · 60–120 (local 0–60) · full-bleed blue slide, floating task cards, question slams word by word.
// ref: 0–3 whip-down residue of the emblem, flat wavy orange; cards appear at 6 in 3 depth layers drifting;
// words land at 7, 12, 22(I), 27, 39; cards rush toward camera over the last ~6 frames.
const TASKS = [
	'Send payment reminder',
	'Follow up lead',
	'Update the sheet',
	'Reply to DM',
	'Chase invoice',
	'Log attendance',
	'Book the call',
	'Post on socials',
	'Qualify lead',
	'Draft the email',
	'Track expenses',
	'Answer the phone',
];

type CardDef = {x: number; y: number; z: number; w: number; rot: number; text: string; lag: number};
const CARDS: CardDef[] = Array.from({length: 26}, (_, i) => {
	const z = i % 3; // 0 far, 1 mid, 2 near
	// keep the headline band (y 43–58%) mostly clear
	let y = hash(i * 4.7) * 100;
	if (y > 38 && y < 62) y = y < 50 ? y - 26 : y + 24;
	return {
		x: hash(i * 2.9) * 108 - 4,
		y,
		z,
		w: [210, 290, 370][z] * (0.85 + hash(i) * 0.3),
		rot: (hash(i * 1.7) - 0.5) * 30,
		text: TASKS[i % TASKS.length],
		lag: Math.floor(hash(i * 6.1) * 8),
	};
});

const Blob: React.FC<{x: number; y: number; w: number; h: number; c: string; rot: number}> = ({x, y, w, h, c, rot}) => (
	<div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: w, height: h, borderRadius: '50%', background: c, filter: 'blur(60px)', transform: `translate(-50%,-50%) rotate(${rot}deg)`}} />
);

export const ShotB: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const drift = f * 0.6;
	const rush = tween(f, [dur - 7, dur], [0, 1], EASE.in);
	const push = interpolate(f, [0, dur], [1, 1.06]);
	return (
		<AbsoluteFill style={{background: C.accent, overflow: 'hidden'}}>
			{/* wavy gradient field */}
			<AbsoluteFill style={{transform: `scale(${push})`}}>
				<Blob x={20 + Math.sin(f / 20) * 3} y={25} w={1400} h={380} c="#1A8FFF" rot={-14} />
				<Blob x={70} y={60 + Math.sin(f / 18) * 3} w={1500} h={360} c="#006FE6" rot={-12} />
				<Blob x={40} y={95} w={1500} h={300} c="#0066D6" rot={-10} />
				<Blob x={80} y={10} w={900} h={260} c="#2B99FF" rot={-16} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.06), rgba(0,40,120,0.18) 100%)'}} />
			</AbsoluteFill>

			{/* floating task cards */}
			{CARDS.map((c, i) => {
				const appear = tween(f, [5 + c.lag, 11 + c.lag], [0, 1], EASE.out);
				if (appear <= 0) return null;
				const depth = [0.55, 0.8, 1][c.z];
				const blur = [3.5, 1.2, 0][c.z];
				const x = c.x - (drift * depth) / 12;
				const y = c.y - (drift * depth) / 30;
				// rush: cards fly toward camera from the centre outward
				const rx = (c.x - 50) * rush * 1.6;
				const ry = (c.y - 50) * rush * 1.6;
				const sc = depth * (0.85 + appear * 0.15) * (1 + rush * (2.2 + c.z));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x + rx}%`,
							top: `${y + ry}%`,
							width: c.w,
							transform: `translate(-50%,-50%) perspective(900px) rotateY(${c.rot}deg) rotateX(${c.rot * 0.3}deg) scale(${sc})`,
							opacity: appear * (0.55 + 0.45 * depth) * (1 - rush * 0.6),
							filter: `blur(${blur + rush * 10}px)`,
							background: '#fff',
							borderRadius: 10,
							padding: `${c.w * 0.07}px ${c.w * 0.08}px`,
							boxShadow: '0 14px 30px -10px rgba(0,30,90,0.45)',
						}}
					>
						<div style={{display: 'flex', gap: 6, alignItems: 'center', marginBottom: c.w * 0.05}}>
							<div style={{width: c.w * 0.07, height: c.w * 0.07, borderRadius: '50%', background: '#DCE6F5'}} />
							<div style={{width: c.w * 0.3, height: c.w * 0.03, borderRadius: 4, background: '#E5ECF6'}} />
						</div>
						<div style={{fontFamily: F.body, fontWeight: 500, fontSize: c.w * 0.072, color: '#6B7688', whiteSpace: 'nowrap'}}>
							{c.text}
							<span style={{color: C.accent, fontWeight: 700}}>{Math.floor((f + i) / 8) % 2 ? '|' : ' '}</span>
						</div>
					</div>
				);
			})}

			{/* the question */}
			<div style={{position: 'absolute', left: 150, top: 470, transform: `scale(${interpolate(f, [7, dur], [1, 1.07], clamp)})`, transformOrigin: '0% 50%', filter: rush > 0 ? `blur(${rush * 6}px)` : undefined}}>
				<SlamLine
					words={[{t: 'still'}, {t: 'running'}, {t: 'your'}, {t: 'business'}, {t: 'manually?'}]}
					times={[7, 12, 20, 25, 36]}
					size={104}
					color="#FFFFFF"
					style={{textShadow: '0 6px 30px rgba(0,40,110,0.35)'}}
				/>
			</div>
		</AbsoluteFill>
	);
};
