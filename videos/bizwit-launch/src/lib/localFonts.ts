import {continueRender, delayRender, staticFile} from 'remotion';

// Local brand fonts (public/fonts). Blocks the first frame until all faces are ready.
const FACES: [string, string, string, string][] = [
	['Figtree', 'figtree-latin-500-normal.woff2', '500', 'normal'],
	['Figtree', 'figtree-latin-600-normal.woff2', '600', 'normal'],
	['Figtree', 'figtree-latin-700-normal.woff2', '700', 'normal'],
	['Figtree', 'figtree-latin-800-normal.woff2', '800', 'normal'],
	['Instrument Serif', 'instrument-serif-latin-400-normal.woff2', '400', 'normal'],
	['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
	['JetBrains Mono', 'jetbrains-mono-latin-400-normal.woff2', '400', 'normal'],
	['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', '500', 'normal'],
];

let started = false;
export const loadLocalFonts = () => {
	if (started || typeof document === 'undefined') return;
	started = true;
	const handle = delayRender('local fonts');
	Promise.all(
		FACES.map(([family, file, weight, style]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style});
			return face.load().then((f) => document.fonts.add(f));
		}),
	)
		.catch((e) => console.warn('[fonts]', e))
		.finally(() => continueRender(handle));
};
