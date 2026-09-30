import React from 'react';
import {Composition} from 'remotion';
import video from './video.json';
import {Main} from './Main';
import {Gallery} from './Gallery';

// Main = the deliverable (size/length from video.json).
// Gallery = component showcase for reference while building; not rendered by default.
export const Root: React.FC = () => (
	<>
		<Composition id={video.id} component={Main} durationInFrames={video.durationInFrames} fps={video.fps} width={video.width} height={video.height} />
		<Composition id="Gallery" component={Gallery} durationInFrames={360} fps={video.fps} width={video.width} height={video.height} />
	</>
);
