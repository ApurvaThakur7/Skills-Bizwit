import {continueRender, delayRender} from 'remotion';
import {getAvailableFonts} from '@remotion/google-fonts';

const requested = new Set<string>();

// render.py sets REMOTION_FONTS_OFFLINE=1 when fonts.gstatic.com is unreachable (locked-down
// cloud sandboxes) → skip Google Fonts and use the fallback stacks below.
const OFFLINE = typeof process !== 'undefined' && process.env && process.env.REMOTION_FONTS_OFFLINE === '1';

// Load Google Fonts by family name ("Inter", "Instrument Serif", "Space Grotesk"...).
// All styles (normal + italic) and weights, latin subset. Unknown names fall back silently.
export const loadFonts = (families: string[]) => {
	if (OFFLINE) return;
	const all = getAvailableFonts();
	for (const family of families) {
		if (!family || requested.has(family)) continue;
		requested.add(family);
		const entry = all.find((f) => f.fontFamily.toLowerCase() === family.toLowerCase());
		if (!entry) {
			console.warn(`[fonts] "${family}" is not a Google Font — use a local @font-face (see cookbook).`);
			continue;
		}
		const handle = delayRender(`Loading font ${family}`, {timeoutInMilliseconds: 60000});
		const guard = setTimeout(() => continueRender(handle), 20000); // never block a render on fonts
		entry
			.load()
			.then((mod: any) => {
				const info = mod.getInfo();
				const waits: Promise<unknown>[] = [];
				for (const style of Object.keys(info.fonts)) {
					const subsets = Object.keys(Object.values(info.fonts[style])[0] as object);
					const res = mod.loadFont(style, {subsets: subsets.includes('latin') ? ['latin'] : subsets.slice(0, 1)});
					if (res?.waitUntilDone) waits.push(res.waitUntilDone().catch(() => null));
				}
				return Promise.all(waits);
			})
			.catch((e: unknown) => console.warn(`[fonts] ${family} failed`, e))
			.finally(() => {
				clearTimeout(guard);
				continueRender(handle);
			});
	}
};

// CSS font stack with sensible fallbacks, so a missing font never renders as Times.
export const stack = (family: string) => {
	const f = family.toLowerCase();
	const tail = /mono|code/.test(f)
		? `ui-monospace, "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace`
		: /serif|playfair|garamond|georgia|times|lora|merriweather|fraunces|dm serif/.test(f) && !/sans/.test(f)
			? `Georgia, "Times New Roman", "Liberation Serif", serif`
			: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Liberation Sans", sans-serif`;
	return `"${family}", ${tail}`;
};
