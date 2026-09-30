import React from 'react';
import {Composition} from 'remotion';
import video from './video.json';
import {Main} from './Main';

export const Root: React.FC = () => (
	<Composition id={video.id} component={Main} durationInFrames={video.durationInFrames} fps={video.fps} width={video.width} height={video.height} />
);
