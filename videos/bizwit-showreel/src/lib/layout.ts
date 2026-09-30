import {useVideoConfig} from 'remotion';

// Aspect-aware layout. Size EVERYTHING in `u` (1u = 1px at 1080 short side) so one scene
// works at 16:9, 9:16, 1:1 and 4:5. Use `vertical` to switch row→column layouts.
export const useLayout = () => {
	const {width: w, height: h} = useVideoConfig();
	const u = Math.min(w, h) / 1080;
	const vertical = h > w * 1.05;
	const square = Math.abs(w - h) / Math.max(w, h) < 0.2;
	// Safe zones: platform UI covers top/bottom of Reels/TikTok/Shorts.
	const safe = vertical
		? {top: 250 * u, bottom: 330 * u, left: 70 * u, right: 70 * u}
		: {top: 90 * u, bottom: 90 * u, left: 120 * u, right: 120 * u};
	return {w, h, u, vertical, square, cx: w / 2, cy: h / 2, safe};
};
