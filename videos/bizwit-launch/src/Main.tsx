import React from 'react';
import {AbsoluteFill, Series, interpolate, useCurrentFrame} from 'remotion';
import {C} from './brand';
import {loadLocalFonts} from './lib/localFonts';
import {Hud} from './scenes/Hud';
import {ShotA} from './scenes/ShotA';
import {ShotB} from './scenes/ShotB';
import {ShotC} from './scenes/ShotC';
import {ShotD} from './scenes/ShotD';
import {ShotE} from './scenes/ShotE';
import {ShotF} from './scenes/ShotF';
import {ShotG, ShotH} from './scenes/ShotG';
import {ShotI, ShotJ} from './scenes/ShotI';
import {ShotK} from './scenes/ShotK';

loadLocalFonts();

// Frame ranges mirror the reference cut points 1:1 (brief/shot-map.md). Sum = 900.
export const SHOTS: {name: string; frames: number; Scene: React.FC<{dur: number}>}[] = [
	{name: 'A-emblem', frames: 60, Scene: ShotA},
	{name: 'B-question', frames: 60, Scene: ShotB},
	{name: 'C-logo', frames: 66, Scene: ShotC},
	{name: 'D-console', frames: 63, Scene: ShotD},
	{name: 'E-count', frames: 105, Scene: ShotE},
	{name: 'F-voice', frames: 126, Scene: ShotF},
	{name: 'G-week', frames: 108, Scene: ShotG},
	{name: 'H-warp', frames: 18, Scene: ShotH},
	{name: 'I-repeat', frames: 99, Scene: ShotI},
	{name: 'J-chart', frames: 15, Scene: ShotJ},
	{name: 'K-end', frames: 180, Scene: ShotK},
];

// Continuous camera: every shot slowly pushes in and drifts (reference never holds a frame still).
const Push: React.FC<{dur: number; i: number; children: React.ReactNode}> = ({dur, i, children}) => {
	const f = useCurrentFrame();
	const z = interpolate(f, [0, dur], [1, 1 + Math.min(0.06, dur * 0.00045)]);
	const dx = interpolate(f, [0, dur], [0, i % 2 ? -14 : 14]);
	const dy = interpolate(f, [0, dur], [0, -6]);
	return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${z})`}}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => (
	<AbsoluteFill style={{background: C.bg}}>
		<Series>
			{SHOTS.map(({name, frames, Scene}, i) => (
				<Series.Sequence key={name} durationInFrames={frames}>
					<Push dur={frames} i={i}>
						<Scene dur={frames} />
					</Push>
				</Series.Sequence>
			))}
		</Series>
		<Hud />
	</AbsoluteFill>
);
