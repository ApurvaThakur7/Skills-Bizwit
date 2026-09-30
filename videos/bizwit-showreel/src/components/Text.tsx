import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../brand';
import {EASE, SPRING, SpringName, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';

type Base = {
	start?: number;
	size?: number; // px at 1080 short side (scaled by u)
	weight?: number;
	font?: string;
	color?: string;
	align?: 'left' | 'center' | 'right';
	letterSpacing?: number; // em
	lineHeight?: number;
	style?: React.CSSProperties;
};

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export type Highlight = {words: string[]; color?: string; italic?: boolean; font?: string; underline?: boolean; weight?: number};

// Words blur in one by one from soft focus to sharp. `\n` breaks lines.
// highlight: style specific words (e.g. red serif italic + drawn underline).
export const BlurInWords: React.FC<Base & {text: string; stagger?: number; dur?: number; highlight?: Highlight; rise?: number}> = ({
	text,
	start = 0,
	stagger = 4,
	dur = 14,
	size = 96,
	weight = 500,
	font = F.display,
	color = C.text,
	align = 'center',
	letterSpacing = -0.02,
	lineHeight = 1.08,
	highlight,
	rise = 18,
	style,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	let i = 0;
	return (
		<div style={{fontFamily: font, fontSize: size * u, fontWeight: weight, color, textAlign: align, letterSpacing: `${letterSpacing}em`, lineHeight, ...style}}>
			{text.split('\n').map((line, li) => (
				<div key={li}>
					{line.split(' ').map((word, wi) => {
						const idx = i++;
						const local = f - start - idx * stagger;
						const p = tween(local, [0, dur], [0, 1]);
						const hl = highlight && highlight.words.map(clean).includes(clean(word));
						const ul = hl && highlight.underline ? tween(local - dur * 0.6, [0, 14], [0, 1], EASE.inOut) : 0;
						return (
							<span
								key={wi}
								style={{
									display: 'inline-block',
									position: 'relative',
									marginRight: '0.26em',
									opacity: p,
									filter: `blur(${(1 - p) * 16 * u}px)`,
									transform: `translateY(${(1 - p) * rise * u}px)`,
									...(hl ? {color: highlight.color ?? C.accent, fontStyle: highlight.italic ? 'italic' : undefined, fontFamily: highlight.font ?? font, fontWeight: highlight.weight ?? weight} : {}),
								}}
							>
								{word}
								{hl && highlight.underline ? <span style={{position: 'absolute', left: 0, bottom: '0.02em', height: Math.max(3, 0.05 * size) * u, width: `${ul * 100}%`, background: highlight.color ?? C.accent, borderRadius: 4}} /> : null}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

// Kinetic word slam: one huge word at a time with outline echoes. Auto-fits width.
export const SlamWords: React.FC<Base & {words: string[]; every?: number; echo?: boolean; lastColor?: string; spring?: SpringName}> = ({
	words,
	every = 20,
	start = 0,
	size = 300,
	weight = 900,
	font = F.display,
	color = C.text,
	lastColor,
	letterSpacing = -0.04,
	echo = true,
	spring = 'slam',
	style,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {w, u} = useLayout();
	const local = f - start;
	if (local < 0) return null;
	const idx = Math.min(Math.floor(local / every), words.length - 1);
	const lf = local - idx * every;
	const s = springAt(lf, fps, 0, spring);
	const scale = 1.7 - 0.7 * s;
	const blur = tween(lf, [0, 6], [16, 0]);
	const word = words[idx];
	const fit = Math.min(size * u, (w * 0.78) / Math.max(1, word.length * 0.66));
	const isLast = idx === words.length - 1;
	const base: React.CSSProperties = {position: 'absolute', whiteSpace: 'nowrap', fontFamily: font, fontWeight: weight, fontSize: fit, letterSpacing: `${letterSpacing}em`, lineHeight: 1};
	const e = tween(lf, [0, 14], [0, 1]);
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>
			{echo &&
				[1.24, 1.15, 1.07].map((k, i) => (
					<div key={k} style={{...base, color: 'transparent', WebkitTextStroke: `${2 * u}px ${color}`, opacity: 0.1 + i * 0.05, transform: `scale(${scale * (1 + (k - 1) * e)})`}}>
						{word}
					</div>
				))}
			<div style={{...base, color: isLast && lastColor ? lastColor : color, filter: `blur(${blur * u}px)`, transform: `scale(${scale})`}}>{word}</div>
		</div>
	);
};

// Lines rise from behind a mask (editorial / keynote headline).
export const MaskLines: React.FC<Base & {lines: string[]; stagger?: number; spring?: SpringName}> = ({
	lines,
	start = 0,
	stagger = 5,
	size = 110,
	weight = 700,
	font = F.display,
	color = C.text,
	align = 'center',
	letterSpacing = -0.03,
	lineHeight = 1.05,
	spring = 'heavy',
	style,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	return (
		<div style={{fontFamily: font, fontWeight: weight, fontSize: size * u, color, textAlign: align, letterSpacing: `${letterSpacing}em`, lineHeight, ...style}}>
			{lines.map((l, i) => {
				const s = springAt(f, fps, start + i * stagger, spring);
				return (
					<div key={i} style={{overflow: 'hidden', paddingBottom: '0.08em'}}>
						<div style={{transform: `translateY(${(1 - s) * 110}%)`}}>{l}</div>
					</div>
				);
			})}
		</div>
	);
};

// Characters rise/pop in with a spring stagger (logos, short titles).
export const CharCascade: React.FC<Base & {text: string; stagger?: number; spring?: SpringName; from?: 'below' | 'scale'}> = ({
	text,
	start = 0,
	stagger = 2,
	size = 200,
	weight = 900,
	font = F.display,
	color = C.text,
	letterSpacing = -0.04,
	spring = 'snappy',
	from = 'below',
	style,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	return (
		<div style={{display: 'flex', justifyContent: 'center', fontFamily: font, fontWeight: weight, fontSize: size * u, color, letterSpacing: `${letterSpacing}em`, lineHeight: 1, ...style}}>
			{text.split('').map((ch, i) => {
				const s = springAt(f, fps, start + i * stagger, spring);
				return (
					<span key={i} style={{display: 'inline-block', overflow: from === 'below' ? 'hidden' : undefined, whiteSpace: 'pre'}}>
						<span style={{display: 'inline-block', transform: from === 'below' ? `translateY(${(1 - s) * 105}%)` : `scale(${s})`, opacity: from === 'scale' ? s : 1}}>{ch}</span>
					</span>
				);
			})}
		</div>
	);
};

export const Typewriter: React.FC<Base & {text: string; cps?: number; caret?: boolean}> = ({text, start = 0, cps = 30, size = 40, weight = 400, font = F.mono, color = C.text, caret = true, style, letterSpacing = 0}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const n = Math.max(0, Math.floor(((f - start) / fps) * cps));
	const done = n >= text.length;
	const on = !done || Math.floor(f / 15) % 2 === 0;
	return (
		<div style={{fontFamily: font, fontSize: size * u, fontWeight: weight, color, letterSpacing: `${letterSpacing}em`, whiteSpace: 'pre-wrap', ...style}}>
			{text.slice(0, n)}
			{caret ? <span style={{opacity: on ? 1 : 0, marginLeft: 2}}>▍</span> : null}
		</div>
	);
};

// Number ticks up. format: 'comma' (12,500) | 'compact' (12.5K) | 'plain'
export const CountUp: React.FC<Base & {from?: number; to: number; dur?: number; prefix?: string; suffix?: string; decimals?: number; format?: 'comma' | 'compact' | 'plain'}> = ({
	from = 0,
	to,
	start = 0,
	dur = 45,
	prefix = '',
	suffix = '',
	decimals = 0,
	format = 'comma',
	size = 160,
	weight = 800,
	font = F.display,
	color = C.text,
	letterSpacing = -0.04,
	style,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const v = tween(f, [start, start + dur], [from, to], EASE.out);
	const txt =
		format === 'compact'
			? Intl.NumberFormat('en-US', {notation: 'compact', maximumFractionDigits: 1}).format(v)
			: format === 'comma'
				? v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})
				: v.toFixed(decimals);
	return <div style={{fontFamily: font, fontSize: size * u, fontWeight: weight, color, letterSpacing: `${letterSpacing}em`, fontVariantNumeric: 'tabular-nums', lineHeight: 1, ...style}}>{prefix + txt + suffix}</div>;
};

// Rolling word swap: "Built for [teams → founders → agencies]".
export const WordSwap: React.FC<Base & {words: string[]; every?: number; wordColor?: string; prefix?: string}> = ({
	words,
	every = 24,
	start = 0,
	prefix = '',
	size = 110,
	weight = 700,
	font = F.display,
	color = C.text,
	wordColor = C.accent,
	letterSpacing = -0.03,
	style,
}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const local = Math.max(0, f - start);
	const idx = Math.min(Math.floor(local / every), words.length - 1);
	const t = idx === words.length - 1 ? 1 : 1; // hold last
	const lf = local - idx * every;
	const p = tween(lf, [0, 10], [0, 1], EASE.out);
	const prev = words[Math.max(0, idx - 1)];
	return (
		<div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.25em', fontFamily: font, fontSize: size * u, fontWeight: weight, color, letterSpacing: `${letterSpacing}em`, lineHeight: 1.1, ...style}}>
			{prefix ? <span>{prefix}</span> : null}
			<span style={{position: 'relative', display: 'inline-block', overflow: 'hidden', color: wordColor, opacity: t}}>
				<span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 100}%)`}}>{words[idx]}</span>
				{idx > 0 && p < 1 ? <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-p * 100}%)`}}>{prev}</span> : null}
			</span>
		</div>
	);
};

// Marker highlight that sweeps behind text (explainers).
export const Marker: React.FC<Base & {text: string; markColor?: string; dur?: number}> = ({text, start = 0, dur = 16, size = 80, weight = 700, font = F.display, color = C.ink, markColor = C.accent3, style}) => {
	const f = useCurrentFrame();
	const {u} = useLayout();
	const p = tween(f, [start, start + dur], [0, 1], EASE.inOut);
	return (
		<span style={{position: 'relative', display: 'inline-block', fontFamily: font, fontSize: size * u, fontWeight: weight, color, padding: '0 0.12em', ...style}}>
			<span style={{position: 'absolute', left: 0, bottom: '0.08em', height: '0.55em', width: `${p * 100}%`, background: markColor, zIndex: 0, borderRadius: 6}} />
			<span style={{position: 'relative'}}>{text}</span>
		</span>
	);
};

// Small uppercase mono label (eyebrows, chapter tags, HUD).
export const Label: React.FC<Base & {text: string}> = ({text, size = 18, font = F.mono, color = C.muted, weight = 500, letterSpacing = 0.25, style}) => {
	const {u} = useLayout();
	return <div style={{fontFamily: font, fontSize: size * u, fontWeight: weight, color, letterSpacing: `${letterSpacing}em`, textTransform: 'uppercase', ...style}}>{text}</div>;
};

export {SPRING};
