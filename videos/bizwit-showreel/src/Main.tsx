import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {C} from './brand';
import {Grain, Vignette} from './components/Backgrounds';
import {Flash, WhipIn, ZoomIn} from './components/Transitions';
import {S1Emblem, S2Question, S3Meet, S4Workflow, S5Agents, S6Data, S7Numbers, S8Outro} from './scenes/Scenes';

// The timeline. Durations are in frames and MUST sum to video.json durationInFrames (900).
export const SCENES = {emblem: 75, question: 75, meet: 60, workflow: 135, agents: 135, data: 135, numbers: 120, outro: 165};

export const Main: React.FC = () => (
	<AbsoluteFill style={{background: C.bg}}>
		<Series>
			<Series.Sequence durationInFrames={SCENES.emblem}>
				<S1Emblem dur={SCENES.emblem} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.question}>
				<ZoomIn frames={10}>
					<S2Question dur={SCENES.question} />
				</ZoomIn>
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.meet}>
				<S3Meet dur={SCENES.meet} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.workflow}>
				<ZoomIn>
					<S4Workflow dur={SCENES.workflow} />
				</ZoomIn>
				<Flash frames={5} strength={0.35} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.agents}>
				<WhipIn dir="left">
					<S5Agents dur={SCENES.agents} />
				</WhipIn>
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.data}>
				<ZoomIn>
					<S6Data dur={SCENES.data} />
				</ZoomIn>
				<Flash frames={5} strength={0.3} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.numbers}>
				<WhipIn dir="up">
					<S7Numbers dur={SCENES.numbers} />
				</WhipIn>
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENES.outro}>
				<ZoomIn frames={16}>
					<S8Outro dur={SCENES.outro} />
				</ZoomIn>
				<Flash frames={6} strength={0.4} />
			</Series.Sequence>
		</Series>
		<Vignette strength={0.5} />
		<Grain opacity={0.05} />
	</AbsoluteFill>
);
