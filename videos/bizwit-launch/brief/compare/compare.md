# Render vs reference — 8/8 PASS

- Reference: /home/user/Skills-Bizwit/videos/bizwit-launch/brief/reference/ref.mp4
- Render: /home/user/Skills-Bizwit/videos/bizwit-launch/out/bizwit-ai-launch.mp4

| metric | reference | render | result | fix |
|---|---|---|---|---|
| duration (s) | 30.2 | 30.2 | PASS |  |
| static frames | 10% | 16% | PASS |  |
| mean motion | 0.0254 | 0.0236 | PASS |  |
| brightness rhythm (corr) | 1.00 | 0.99 | PASS |  |
| mean brightness | 71 | 72 | PASS |  |
| motion peaks (corr) | 1.00 | 0.88 | PASS |  |
| shots / avg length | 8 / 3.8s | 9 / 3.4s | PASS |  |
| loudness (dBFS RMS) | -11.6 | -14.0 | PASS |  |

Brightness curve (30 bins, 0–100):
- ref:    6 13 56 47 93 91 95 95 92 91 91 92 93 93 92 92 94 93 92 54 15 9 10 9 92 90 90 88 88 88
- render: 5 10 55 59 84 93 95 90 95 93 92 93 95 95 94 94 96 95 95 61 16 6 6 6 93 92 91 90 90 90

Motion curve (30 bins, ×1000):
- ref:    4 63 34 95 107 9 10 11 16 10 4 16 10 3 6 9 10 5 7 101 77 12 9 12 104 3 5 6 2 2
- render: 3 39 46 21 154 5 10 45 8 8 4 11 5 3 2 3 7 3 3 106 91 8 3 7 99 3 3 4 3 3

Side-by-side sheets (REF top, OURS bottom): side_by_side_01.jpg, side_by_side_02.jpg

Per-shot filmstrips (REF top / OURS bottom): shot_00.jpg, shot_01.jpg, shot_02.jpg, shot_03.jpg, shot_04.jpg, shot_05.jpg, shot_06.jpg, shot_07.jpg, shot_08.jpg, shot_09.jpg, shot_10.jpg, shot_11.jpg, shot_12.jpg, shot_13.jpg, shot_14.jpg, shot_15.jpg, shot_16.jpg

Read the sheets: does each shot MOVE the same way (entry, easing, blur, camera, exit)? Same scale, frame fill, depth, colour roles?