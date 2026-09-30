import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {C, F} from './brand';
import {GridLines, RadialBg, Solid} from './components/Backgrounds';
import {Hud} from './components/Brand';
import {Captions, autoWords} from './components/Captions';
import {GlassCube, GlassOrb, ParticleSphere, TileGrid} from './components/FX';
import {Label, MaskLines, Marker, Typewriter, WordSwap} from './components/Text';
import {Pill, Toggle} from './components/UI';
import {useLayout} from './lib/layout';

// Showcase of library pieces not used in the Main example. Render with --comp Gallery.
const Panel: React.FC<{title: string; children: React.ReactNode; light?: boolean}> = ({title, children, light}) => {
	const {u} = useLayout();
	return (
		<AbsoluteFill>
			{children}
			<Label text={title} color={light ? C.ink : C.text} style={{position: 'absolute', left: 60 * u, top: 50 * u}} />
		</AbsoluteFill>
	);
};

export const Gallery: React.FC = () => {
	const {u} = useLayout();
	return (
		<Series>
			<Series.Sequence durationInFrames={60}>
				<Panel title="TileGrid">
					<Solid />
					<TileGrid waveAt={25} />
				</Panel>
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<Panel title="ParticleSphere">
					<RadialBg inner="#2A2360" outer="#07070B" />
					<ParticleSphere />
				</Panel>
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<Panel title="GlassCube + GlassOrb + GridLines floor">
					<RadialBg inner="#1A1440" />
					<GridLines floor color={C.accent2} opacity={0.35} />
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
						<GlassCube />
					</AbsoluteFill>
					<GlassOrb x={420} y={300} size={220} seed={1} />
					<GlassOrb x={1500} y={700} size={300} hue={300} seed={2} />
				</Panel>
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<Panel title="MaskLines + WordSwap + Marker" light>
					<Solid color={C.paper} />
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40 * u}}>
						<MaskLines lines={['Motion is', 'a language.']} color={C.ink} />
						<WordSwap prefix="Built for" words={['founders', 'agencies', 'teams']} every={16} start={10} color={C.ink} size={70} />
						<Marker text="no editor needed" start={20} size={60} />
					</AbsoluteFill>
				</Panel>
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<Panel title="Captions + Pill + Toggle">
					<RadialBg />
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 30 * u, flexDirection: 'row'}}>
						<Pill text="New · v2.0" dot={C.accent3} />
						<Toggle at={15} />
					</AbsoluteFill>
					<Captions words={autoWords('Every frame here is written in code', 5, 55)} />
				</Panel>
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<Panel title="Hud + Typewriter">
					<Solid />
					<Hud chapter="05 / TERMINAL" />
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
						<Typewriter text={'> npx remotion render\n> rendering 600 frames…'} size={40} font={F.mono} />
					</AbsoluteFill>
				</Panel>
			</Series.Sequence>
		</Series>
	);
};
