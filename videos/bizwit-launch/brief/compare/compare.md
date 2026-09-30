# Render vs reference — 5/8 PASS

- Reference: /home/user/Skills-Bizwit/videos/bizwit-launch/brief/reference/ref.mp4
- Render: /home/user/Skills-Bizwit/videos/bizwit-launch/out/bizwit-ai-launch.mp4

| metric | reference | render | result | fix |
|---|---|---|---|---|
| duration (s) | 30.2 | 36.2 | FIX | Match the reference length (scale scene durations proportionally). |
| static frames | 10% | 17% | PASS |  |
| mean motion | 0.0254 | 0.0257 | PASS |  |
| brightness rhythm (corr) | 1.00 | 0.41 | FIX | Light/dark sequence differs: copy the reference's background value per shot (dark ↔ full-colour ↔ white). Map roles: reference white scenes → light scenes with brand accents, reference colour slide → brand accent slide. |
| mean brightness | 71 | 63 | PASS |  |
| motion peaks (corr) | 1.00 | 0.10 | FIX | Big moments happen at different times: align transitions/slams to the reference's shot times (breakdown.md). |
| shots / avg length | 8 / 3.8s | 11 / 3.3s | PASS |  |
| loudness (dBFS RMS) | -11.6 | -13.4 | PASS |  |

Brightness curve (30 bins, 0–100):
- ref:    6 13 56 47 93 91 95 95 92 91 91 92 93 93 92 92 94 93 92 54 15 9 10 9 92 90 90 88 88 88
- render: 5 23 59 74 93 96 91 94 92 93 95 94 94 37 15 17 17 18 75 95 95 45 7 6 6 94 92 91 91 91

Motion curve (30 bins, ×1000):
- ref:    4 63 34 95 107 9 10 11 16 10 4 16 10 3 6 9 10 5 7 101 77 12 9 12 104 3 5 6 2 2
- render: 3 63 11 141 4 8 40 9 4 10 5 3 3 82 12 8 9 7 73 4 4 160 7 2 6 82 3 4 3 2

Side-by-side sheets (REF top, OURS bottom): side_by_side_01.jpg, side_by_side_02.jpg

Per-shot filmstrips (REF top / OURS bottom): shot_00.jpg, shot_01.jpg, shot_02.jpg, shot_03.jpg, shot_04.jpg, shot_05.jpg, shot_06.jpg, shot_07.jpg, shot_08.jpg, shot_09.jpg, shot_10.jpg, shot_11.jpg, shot_12.jpg, shot_13.jpg, shot_14.jpg, shot_15.jpg, shot_16.jpg

Read the sheets: does each shot MOVE the same way (entry, easing, blur, camera, exit)? Same scale, frame fill, depth, colour roles?