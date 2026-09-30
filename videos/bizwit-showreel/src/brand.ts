// Brand tokens — the ONLY place colors/fonts/radii live. Every component reads from here,
// so a whole video re-themes by editing this file. Fill from site.json / the reference palette.
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {stack} from './lib/fonts';

// Fonts are bundled locally (from @fontsource) because the sandbox browser can't reach Google Fonts.
const local: [string, string, string, string][] = [
	['Figtree', 'figtree-latin-500-normal.woff2', '500', 'normal'],
	['Figtree', 'figtree-latin-600-normal.woff2', '600', 'normal'],
	['Figtree', 'figtree-latin-700-normal.woff2', '700', 'normal'],
	['Figtree', 'figtree-latin-800-normal.woff2', '800', 'normal'],
	['Instrument Serif', 'instrument-serif-latin-400-normal.woff2', '400', 'normal'],
	['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
	['JetBrains Mono', 'jetbrains-mono-latin-400-normal.woff2', '400', 'normal'],
	['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', '500', 'normal'],
];
for (const [family, file, weight, style] of local) loadFont({family, url: staticFile(`fonts/${file}`), weight, style});

export const brand = {
	name: 'BizwitAI',
	colors: {
		bg: '#000000',
		surface: '#0D0F17', // embossed panels
		panel: '#04070D',
		paper: '#F4F6FA',
		text: '#FFFFFF',
		ink: '#04070D',
		muted: '#D5DBE6',
		dim: 'rgba(213,219,230,0.55)',
		accent: '#0080FF', // electric blue: orb, buttons, full-bleed slide
		accent2: '#009DFF', // sky blue
		accent3: '#814AC8', // violet, subtle glows only
	},
	fonts: {
		display: 'Figtree',
		body: 'Figtree',
		serif: 'Instrument Serif',
		mono: 'JetBrains Mono',
	},
	radius: 32,
	logo: null as string | null,
	url: 'bizwitai.com',
};


export const C = brand.colors;
// F = font stacks with fallbacks (use these in styles); brand.fonts = raw family names.
export const F = Object.fromEntries(Object.entries(brand.fonts).map(([k, v]) => [k, stack(v)])) as typeof brand.fonts;
