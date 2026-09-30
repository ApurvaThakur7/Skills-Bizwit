import React from 'react';
import {Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {brand} from '../brand';
import {EASE, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

const src = (s: string) => (/^(https?:|data:)/.test(s) ? s : staticFile(s));

// Screenshot / photo with rounded corners, shadow and optional Ken Burns (slow zoom/pan).
export const Screenshot: React.FC<{
	src: string; width?: number; height?: number; radius?: number; zoom?: [number, number]; pan?: [number, number]; dur?: number; shadow?: boolean; fit?: 'cover' | 'contain'; style?: React.CSSProperties;
}> = ({src: s, width = 1400, height, radius = brand.radius, zoom = [1, 1], pan = [0, 0], dur = 120, shadow = true, fit = 'cover', style}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [0, dur], [0, 1], EASE.inOut);
	const z = zoom[0] + (zoom[1] - zoom[0]) * p;
	return (
		<div style={{width: width * u, height: height ? height * u : undefined, borderRadius: radius * u, overflow: 'hidden', boxShadow: shadow ? `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.28)` : undefined, ...style}}>
			<Img src={src(s)} style={{width: '100%', height: height ? '100%' : undefined, objectFit: fit, display: 'block', transform: `scale(${z}) translate(${pan[0] * p}%, ${pan[1] * p}%)`}} />
		</div>
	);
};

// Supplied footage (public/ path). Muted by default — audio is muxed at render time.
export const Footage: React.FC<{src: string; startFrom?: number; style?: React.CSSProperties; muted?: boolean}> = ({src: s, startFrom = 0, style, muted = true}) => (
	<OffthreadVideo src={src(s)} startFrom={startFrom} muted={muted} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);
