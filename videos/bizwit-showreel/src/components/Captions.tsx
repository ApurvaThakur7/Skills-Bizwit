import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../brand';
import {springAt} from '../lib/anim';
import {useLayout} from '../lib/layout';

export type Word = {text: string; start: number; end: number}; // frames (absolute within the Sequence)

// Word-timed captions. Groups words into short pages; active word pops + takes the accent.
// For voice-over: get word timings (Whisper) and convert seconds → frames.
export const Captions: React.FC<{words: Word[]; perPage?: number; y?: number; size?: number; color?: string; active?: string; stroke?: boolean; uppercase?: boolean}> = ({
	words, perPage = 4, y = 0.72, size = 72, color = '#FFFFFF', active = C.accent3, stroke = true, uppercase = true,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {h, u} = useLayout();
	const pages: Word[][] = [];
	for (let i = 0; i < words.length; i += perPage) pages.push(words.slice(i, i + perPage));
	const page = pages.find((p) => f >= p[0].start && f < (p[p.length - 1].end + 6)) ?? null;
	if (!page) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: h * y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `0 ${18 * u}px`, padding: `0 ${80 * u}px`}}>
			{page.map((w, i) => {
				const on = f >= w.start && f < w.end;
				const s = springAt(f, fps, w.start, 'bouncy');
				return (
					<span key={i} style={{fontFamily: F.display, fontWeight: 900, fontSize: size * u, textTransform: uppercase ? 'uppercase' : undefined, color: on ? active : color, transform: `scale(${f >= w.start ? 0.8 + 0.2 * s + (on ? 0.06 : 0) : 0.8})`, opacity: f >= w.start ? 1 : 0.35, WebkitTextStroke: stroke ? `${6 * u}px #000` : undefined, paintOrder: 'stroke fill', display: 'inline-block'}}>
						{w.text}
					</span>
				);
			})}
		</div>
	);
};

// Helper: evenly time a sentence across a frame range (when no real timings exist).
export const autoWords = (sentence: string, start: number, end: number): Word[] => {
	const ws = sentence.split(/\s+/).filter(Boolean);
	const step = (end - start) / ws.length;
	return ws.map((t, i) => ({text: t, start: Math.round(start + i * step), end: Math.round(start + (i + 1) * step)}));
};
