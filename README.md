# Sejarah Skizofrenia — Bagaimana Manusia Mula Memahami Penyakit Ini?

A faceless animated documentary (Malaysian Malay) for the **Dr Azren** YouTube channel. It is narrated with Dr Azren's own recording and built as an editable HyperFrames composition.

## Contents

| Path | What |
|---|---|
| `video/` | HyperFrames project (`index.html` is generated, see below) |
| `video/assets/js/scenes_a.js`, `scenes_b.js`, `scenes_c.js` | The 24 scenes, every animation anchored to narration words |
| `video/assets/js/lib.js`, `main.js` | Animation helpers, captions, chapter markers, grain, timeline registration |
| `video/assets/js/words.js`, `captions.js`, `plan.js` | Generated timing data (word timestamps, caption phrases, scene windows) |
| `video/assets/img`, `vid`, `book`, `tex`, `fonts` | Higgsfield illustrations and animated inserts, the book cover faces, textures, fonts |
| `deliverables/` | SRT subtitles, final transcript, review notes, credits, audio stems |
| `tools/` | Pipeline scripts (transcription, edit list, alignment, captions, index generation, SFX extraction, mix, master) |

## Pipeline

```bash
# 1. narration edit (islands → EDL → cleaned narration), see tools/build_edl.py
# 2. align the corrected script to word times and build captions + SRT
python3 tools/align_script.py && python3 tools/make_captions.py
# 3. generate plan.js + index.html (scene windows anchored to words)
python3 tools/gen_index.py assets/audio/final_mix.wav
# 4. extract SFX cues from the composition, mix and master
python3 tools/extract_sfx.py && python3 tools/mix.py && tools/master.sh
# 5. render (4K UHD, 30 fps, H.264 + AAC 48 kHz)
cd video && npx hyperframes render --resolution 4k --fps 30 --quality delivery --output ../out/Sejarah_Skizofrenia_4K.mp4
```

Editing: change a scene in `video/assets/js/scenes_*.js`, rerun step 3 (and step 4 if the sound cues moved), then preview with `cd video && npx hyperframes preview`.
