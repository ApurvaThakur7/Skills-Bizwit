// Brand tokens — Bizwit AI (from the user's brand kit / bizwitai.com).
// Fonts are local woff2 files (public/fonts) loaded by lib/localFonts.ts — Google Fonts is unreachable here.
import {stack} from './lib/fonts';

export const brand = {
	name: 'Bizwit AI',
	colors: {
		bg: '#000000',
		space: '#04070D', // dark scenes
		panel: '#0D0F17',
		panel2: '#10131C',
		text: '#FFFFFF',
		muted: '#D5DBE6',
		paper: '#F5F7FA', // light scenes (reference rhythm), cool white
		paperEdge: '#E4E8EE',
		card: '#FFFFFF',
		ink: '#0A0D14',
		inkSoft: '#5B6474',
		line: 'rgba(10,13,20,0.08)',
		accent: '#0080FF',
		accent2: '#009DFF',
		accent3: '#814AC8',
		lime: '#EFFC76',
		ok: '#22B573',
	},
	fonts: {
		display: 'Figtree',
		body: 'Figtree',
		serif: 'Instrument Serif',
		mono: 'JetBrains Mono',
	},
	radius: 22,
	url: 'bizwitai.com',
};

export const C = brand.colors;
export const F = Object.fromEntries(Object.entries(brand.fonts).map(([k, v]) => [k, stack(v)])) as typeof brand.fonts;
