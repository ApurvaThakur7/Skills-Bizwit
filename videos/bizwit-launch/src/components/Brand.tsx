import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, brand} from '../brand';
import {EASE, springAt, tween} from '../lib/anim';
import {useLayout} from '../lib/layout';
import {CharCascade, Label} from './Text';

const src = (s: string) => (/^(https?:|data:)/.test(s) ? s : staticFile(s));

// Logo image (public/ path). Height in px @1080.
export const Logo: React.FC<{src?: string | null; height?: number; style?: React.CSSProperties}> = ({src: s = brand.logo, height = 120, style}) => {
	const {u} = useLayout();
	if (!s) return null;
	return <Img src={src(s)} style={{height: height * u, width: 'auto', objectFit: 'contain', ...style}} />;
};

// Logo reveal: mark scales/unblurs in, wordmark letters rise, accent line draws, tagline fades.
export const LogoReveal: React.FC<{text?: string; logo?: string | null; tagline?: string; start?: number; size?: number; color?: string; lineColor?: string}> = ({
	text = brand.name, logo = brand.logo, tagline, start = 0, size = 220, color = C.text, lineColor = C.accent,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const m = springAt(f, fps, start, 'heavy');
	const line = tween(f, [start + 14, start + 36], [0, 1], EASE.out);
	const tag = tween(f, [start + 26, start + 42], [0, 1]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 * u}}>
			{logo ? <div style={{transform: `scale(${0.6 + 0.4 * m})`, filter: `blur(${(1 - m) * 20 * u}px)`, opacity: m}}><Logo src={logo} height={size * 0.8} /></div> : null}
			{text ? <CharCascade text={text} start={start + (logo ? 6 : 0)} size={size} color={color} /> : null}
			<div style={{width: `${line * 60}%`, minWidth: 0, height: 5 * u, background: lineColor, borderRadius: 4, alignSelf: 'center'}} />
			{tagline ? <div style={{opacity: tag * 0.85, transform: `translateY(${(1 - tag) * 12 * u}px)`, fontFamily: F.body, fontSize: 34 * u, color}}>{tagline}</div> : null}
		</div>
	);
};

// End card: headline + CTA pill + URL.
export const EndCard: React.FC<{headline: string; cta?: string; url?: string; start?: number; color?: string; ctaBg?: string; ctaColor?: string}> = ({
	headline, cta = 'Get started', url = brand.url, start = 0, color = C.text, ctaBg = C.accent, ctaColor = '#fff',
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u} = useLayout();
	const h = springAt(f, fps, start, 'heavy');
	const c = springAt(f, fps, start + 10, 'bouncy');
	const t = tween(f, [start + 18, start + 32], [0, 1]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44 * u, textAlign: 'center'}}>
			<div style={{whiteSpace: 'pre-line', fontFamily: F.display, fontWeight: 800, fontSize: 110 * u, letterSpacing: '-0.035em', lineHeight: 1.02, color, transform: `translateY(${(1 - h) * 40 * u}px)`, opacity: h}}>{headline}</div>
			<div style={{transform: `scale(${c})`, padding: `${24 * u}px ${56 * u}px`, borderRadius: 999, background: ctaBg, color: ctaColor, fontFamily: F.body, fontWeight: 700, fontSize: 36 * u}}>{cta}</div>
			{url ? <div style={{opacity: t * 0.7, fontFamily: F.mono, fontSize: 26 * u, letterSpacing: '0.12em', color}}>{url}</div> : null}
		</div>
	);
};

// Viewfinder / HUD overlay: corner brackets, title, timecode, chapter, scrubber.
export const Hud: React.FC<{title?: string; chapter?: string; color?: string; total?: number; showSpecs?: boolean}> = ({title = `${brand.name} / 2026`, chapter = '', color = C.text, total, showSpecs = true}) => {
	const f = useCurrentFrame();
	const {fps, durationInFrames, width, height} = useVideoConfig();
	const {u} = useLayout();
	const T = total ?? durationInFrames;
	const pad = (n: number) => String(n).padStart(2, '0');
	const tc = `TC 00:00:${pad(Math.floor(f / fps))}:${pad(f % fps)}`;
	const m = 40 * u;
	const corner = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', width: 34 * u, height: 34 * u, borderColor: color, borderStyle: 'solid', borderWidth: 0, opacity: 0.8, ...s});
	const lab: React.CSSProperties = {position: 'absolute'};
	const bw = 2 * u;
	const prog = f / Math.max(1, T - 1);
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			<div style={corner({top: m, left: m, borderTopWidth: bw, borderLeftWidth: bw})} />
			<div style={corner({top: m, right: m, borderTopWidth: bw, borderRightWidth: bw})} />
			<div style={corner({bottom: m, left: m, borderBottomWidth: bw, borderLeftWidth: bw})} />
			<div style={corner({bottom: m, right: m, borderBottomWidth: bw, borderRightWidth: bw})} />
			<Label text={title} color={color} style={{...lab, top: m + 18 * u, left: m + 56 * u}} />
			<Label text={tc} color={color} style={{...lab, top: m + 18 * u, right: m + 56 * u}} />
			{chapter ? <Label text={chapter} color={color} style={{...lab, bottom: m + 18 * u, left: m + 56 * u}} /> : null}
			{showSpecs ? <Label text={`${width} × ${height} / ${fps} FPS`} color={color} style={{...lab, bottom: m + 18 * u, right: m + 56 * u}} /> : null}
			<div style={{position: 'absolute', left: m + 56 * u, right: m + 56 * u, bottom: m + 60 * u, height: 12 * u}}>
				{Array.from({length: 41}).map((_, i) => <div key={i} style={{position: 'absolute', left: `${(i / 40) * 100}%`, bottom: 0, width: 1.5, height: (i % 10 === 0 ? 12 : 5) * u, background: color, opacity: 0.4}} />)}
				<div style={{position: 'absolute', left: 0, bottom: 0, height: 2, width: `${prog * 100}%`, background: color}} />
				<div style={{position: 'absolute', left: `${prog * 100}%`, bottom: -4 * u, width: 3 * u, height: 20 * u, background: C.accent}} />
			</div>
		</div>
	);
};
