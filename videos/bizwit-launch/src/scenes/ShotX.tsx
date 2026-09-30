import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../brand';
import {EASE, clamp, tween} from '../lib/anim';
import {DropChars, Orb, Space} from '../lib/kit';

// X · 480–660 (local 0–180) · NEW (not in the reference): AI creatives showcase, built in the reference's
// idiom — dark orb scene (like its "build connections" shot), cards fan out in 3D (like its tweet stack),
// headline types per char. Bizwit's real creatives: Lay's product video plays inside the phone.
const CHIPS = ['AI product videos', 'UGC ads', 'AI product shots', 'Posts & carousels'];
const SLIDES = ['assets/creatives/lays_3.jpg', 'assets/creatives/coke.jpg', 'assets/creatives/lays_16.jpg', 'assets/creatives/lays_9.jpg'];

const Frame: React.FC<{w: number; h: number; children: React.ReactNode; label?: string; style?: React.CSSProperties}> = ({w, h, children, label, style}) => (
	<div style={{position: 'absolute', width: w, ...style}}>
		<div style={{width: w, height: h, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 40px 90px -20px rgba(0,0,0,0.85), 0 0 0 6px rgba(255,255,255,0.03)', background: '#0B0E16'}}>
			{children}
		</div>
		{label && <div style={{marginTop: 12, fontFamily: F.mono, fontSize: 14, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)'}}>{label}</div>}
	</div>
);

export const ShotX: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const flashIn = tween(f, [0, 6], [1, 0]);
	const out = tween(f, [dur - 10, dur], [0, 1], EASE.in);
	const drift = (k: number) => Math.sin((f + k * 40) / 45) * 10;
	// entrance helper: rise from depth with 3D swing + blur
	const enter = (t0: number, dx: number, dy: number, ry: number) => {
		const p = tween(f, [t0, t0 + 14], [0, 1], EASE.out);
		return {
			opacity: p,
			transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotateY(${ry * (1 - p * 0.6)}deg)`,
			filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
		};
	};
	// carousel: swipe to the next slide every 26 f from f70 (8 f eased swipe)
	const k = Math.max(0, (f - 70) / 26);
	const cur = Math.min(SLIDES.length - 1, Math.floor(k) + (f >= 70 ? EASE.inOut(Math.min(1, ((k % 1) * 26) / 8)) : 0));
	const slide = Math.round(cur);
	return (
		<AbsoluteFill>
			<Space seed={13} />
			<Orb size={1400} strength={1} x={62} y={55} />
			<Orb size={700} strength={0.5} x={20} y={30} color="129,74,200" />

			<AbsoluteFill style={{transform: `scale(${1 + out * 0.5}) translateY(${-out * 60}px)`, filter: out > 0 ? `blur(${out * 14}px)` : undefined, opacity: 1 - out * 0.6}}>
				{/* left: headline + tool line + chips */}
				<DropChars segs={[{t: 'ai creatives that'}]} start={6} cps={1.0} size={84} color="#fff" style={{position: 'absolute', left: 150, top: 150}} />
				<DropChars segs={[{t: 'stop the scroll.', accent: true}]} start={22} cps={1.0} size={84} accent={C.accent2} style={{position: 'absolute', left: 150, top: 244}} />
				<div style={{position: 'absolute', left: 152, top: 360, fontFamily: F.mono, fontWeight: 500, fontSize: 16, letterSpacing: '0.26em', color: C.accent2, opacity: tween(f, [34, 42], [0, 1])}}>
					MADE WITH HIGGSFIELD · CLAUDE · AND MORE
				</div>
				<div style={{position: 'absolute', left: 150, top: 430, display: 'flex', flexDirection: 'column', gap: 16}}>
					{CHIPS.map((c, i) => {
						const p = interpolate(f, [44 + i * 6, 49 + i * 6, 53 + i * 6], [0, 1.08, 1], clamp);
						return (
							<div
								key={c}
								style={{
									alignSelf: 'flex-start',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									padding: '13px 22px',
									borderRadius: 999,
									background: 'rgba(255,255,255,0.06)',
									border: '1px solid rgba(255,255,255,0.12)',
									color: '#fff',
									fontFamily: F.body,
									fontWeight: 700,
									fontSize: 24,
									opacity: Math.min(1, p),
									transform: `scale(${p}) translateX(${(1 - Math.min(1, p)) * -30}px)`,
									transformOrigin: '0 50%',
								}}
							>
								<span style={{width: 10, height: 10, borderRadius: '50%', background: i % 2 ? C.accent3 : C.accent2, boxShadow: `0 0 12px ${C.accent2}`}} />
								{c}
							</div>
						);
					})}
				</div>

				{/* right: 3D fan of creatives */}
				<div style={{position: 'absolute', inset: 0, perspective: 1600}}>
					{/* AI campaign collage, back layer */}
					<Frame w={380} h={194} label="AI CAMPAIGN VISUALS" style={{left: 810, top: 140 + drift(1), ...enter(24, -200, -120, 24)}}>
						<Img src={staticFile('assets/creatives/studio.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</Frame>
					{/* AI product shot as a post card */}
					<Frame w={270} h={365} label="AI PRODUCT SHOT" style={{left: 820, top: 470 + drift(2), ...enter(18, -260, 200, 26)}}>
						<Img src={staticFile('assets/creatives/coke.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</Frame>
					{/* hero phone: the product video plays */}
					<div style={{position: 'absolute', left: 1120, top: 200 + drift(0) * 0.6, ...enter(10, 0, 420, -8)}}>
						<div style={{width: 330, height: 590, borderRadius: 46, padding: 10, background: 'linear-gradient(160deg,#2A2F3A,#0B0D12)', boxShadow: `0 50px 120px -30px rgba(0,0,0,0.9), 0 0 80px -10px rgba(0,128,255,0.45)`}}>
							<div style={{width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden', position: 'relative', background: '#000'}}>
								<OffthreadVideo src={staticFile('assets/creatives/lays.mp4')} muted startFrom={20} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
								<div style={{position: 'absolute', top: 12, left: '50%', width: 90, height: 24, marginLeft: -45, borderRadius: 12, background: '#000'}} />
								<div style={{position: 'absolute', left: 16, bottom: 18, fontFamily: F.body, fontWeight: 700, fontSize: 15, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>AI product video · Reels</div>
							</div>
						</div>
					</div>
					{/* UGC ads */}
					<Frame w={330} h={225} label="AI UGC ADS" style={{left: 1480, top: 190 + drift(3), ...enter(28, 260, -100, -24)}}>
						<Img src={staticFile('assets/creatives/ugc.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</Frame>
					{/* carousel that swipes */}
					<Frame w={300} h={300} label="CAROUSELS" style={{left: 1500, top: 520 + drift(4), ...enter(36, 260, 200, -24)}}>
						<div style={{position: 'relative', width: '100%', height: '100%'}}>
							{SLIDES.map((s, i) => {
								return <Img key={s} src={staticFile(s)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `translateX(${(i - cur) * 100}%)`}} />;
							})}
							<div style={{position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6}}>
								{SLIDES.map((_, i) => (
									<div key={i} style={{width: i === slide ? 18 : 7, height: 7, borderRadius: 4, background: i === slide ? '#fff' : 'rgba(255,255,255,0.5)'}} />
								))}
							</div>
						</div>
					</Frame>
				</div>
			</AbsoluteFill>
			{/* hand-off flash from the light shot before, and into the light shot after */}
			<AbsoluteFill style={{background: '#fff', opacity: Math.max(flashIn * 0.9, tween(f, [dur - 4, dur], [0, 0.85]))}} />
		</AbsoluteFill>
	);
};
