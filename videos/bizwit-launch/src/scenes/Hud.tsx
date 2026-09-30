import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {F} from '../brand';

// Reference HUD: tiny mono chapter label top-right, timecode bottom-left, brand bottom-right, corner ticks.
// Runs on the global timeline; colour follows the scene tone.
const CHAPTERS: [number, string][] = [
	[0, 'THE BLANK PAGE'],
	[186, '00 / CONSOLE'],
	[249, '01 / ALWAYS ON'],
	[354, '02 / VOICE AGENTS'],
	[480, '03 / WORKFLOWS'],
	[606, '04 / INTELLIGENCE'],
	[720, 'BIZWITAI.COM'],
];
// frames where the scene is light (dark text HUD)
const LIGHT: [number, number][] = [
	[123, 588],
	[720, 900],
];

export const Hud: React.FC = () => {
	const f = useCurrentFrame();
	const light = LIGHT.some(([a, b]) => f >= a && f < b);
	const blue = f >= 60 && f < 123; // full-bleed blue slide
	const col = blue ? 'rgba(255,255,255,0.7)' : light ? 'rgba(10,13,20,0.45)' : 'rgba(255,255,255,0.4)';
	const chapter = [...CHAPTERS].reverse().find(([a]) => f >= a)?.[1] ?? '';
	const s = Math.floor(f / 30);
	const fr = f % 30;
	const tc = `00:00:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
	const txt: React.CSSProperties = {position: 'absolute', fontFamily: F.mono, fontSize: 13, letterSpacing: '0.18em', color: col};
	const tick = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 14, height: 14, ...st}} />;
	const b = `1.5px solid ${col}`;
	if (f < 8) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{...txt, top: 28, right: 44}}>{chapter}</div>
			<div style={{...txt, bottom: 26, left: 44}}>{tc}</div>
			<div style={{...txt, bottom: 26, right: 44}}>BIZWITAI.COM</div>
			{tick({top: 18, left: 18, borderTop: b, borderLeft: b})}
			{tick({top: 18, right: 18, borderTop: b, borderRight: b})}
			{tick({bottom: 18, left: 18, borderBottom: b, borderLeft: b})}
			{tick({bottom: 18, right: 18, borderBottom: b, borderRight: b})}
		</AbsoluteFill>
	);
};
