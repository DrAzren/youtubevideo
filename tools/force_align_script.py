"""Forced alignment of the corrected script (work/script_corrected.txt) to the cleaned narration
with torchaudio MMS_FA. Rough line positions come from work/words_final.json (Whisper-based);
lines are grouped into ~30 s chunks cut inside real silences, then every word is aligned exactly.
Rewrites work/words_final.json with accurate word starts/ends."""
import json, re
import numpy as np, soundfile as sf, torch, torchaudio

R = '/home/user/youtubevideo/work/'
SR = 16000
a, sr = sf.read(R + 'clean16k.wav', dtype='float32')
assert sr == SR
W = json.load(open(R + 'words_final.json'))
lines = [l.strip() for l in open(R + 'script_corrected.txt') if l.strip()]

# silences in the cleaned narration (for safe chunk boundaries)
hop = int(0.01 * SR)
env = np.array([20 * np.log10(np.sqrt(np.mean(a[i:i + hop] ** 2)) + 1e-9) for i in range(0, len(a) - hop, hop)])
quiet = env < -45

def snap(t, rad=1.2):
    """nearest centre of a quiet run (>=60 ms) to t"""
    i0, i1 = max(0, int((t - rad) * 100)), min(len(quiet), int((t + rad) * 100))
    best, bd = None, 1e9
    i = i0
    while i < i1:
        if quiet[i]:
            j = i
            while j < i1 and quiet[j]: j += 1
            if j - i >= 6:
                c = (i + j) / 200.0
                if abs(c - t) < bd: best, bd = c, abs(c - t)
            i = j
        else:
            i += 1
    return best if best is not None else t

line_start = {}
for w in W:
    line_start.setdefault(w['li'], w['s'])
# chunk lines (~30 s), boundaries snapped into silences
chunks, cur, c0 = [], [], 0.0
for li in range(len(lines)):
    if cur and line_start[li] - c0 > 28:
        b = snap(line_start[li] - 0.12)
        chunks.append((c0, b, cur)); cur, c0 = [], b
    cur.append(li)
chunks.append((c0, len(a) / SR, cur))

bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=True).eval()
tok = bundle.get_tokenizer(); aligner = bundle.get_aligner()

def norm(p):
    p = p.lower().replace('’', "'")
    if re.search(r'\d', p): return '*'
    return re.sub(r"[^a-z']", '', p)

out = []
for c0, c1, lis in chunks:
    words, parts = [], []
    for li in lis:
        for w in lines[li].split():
            ps = [norm(x) for x in re.split(r'-', w)]
            ps = [x for x in ps if x] or ['*']
            words.append((w, li, len(parts), len(ps)))
            parts += ps
    x = torch.from_numpy(a[int(c0 * SR):int(c1 * SR)])[None]
    with torch.inference_mode():
        em, _ = model(x)
    spans = aligner(em[0], tok(parts))
    ratio = x.shape[1] / em.shape[1] / SR
    for w, li, k, n in words:
        s = c0 + spans[k][0].start * ratio
        e = c0 + spans[k + n - 1][-1].end * ratio
        out.append(dict(w=w, s=round(s, 3), e=round(e, 3), li=li))
    print(f'chunk {c0:7.2f}-{c1:7.2f}: {len(words)} words', flush=True)
json.dump(out, open(R + 'words_final.json', 'w'), ensure_ascii=False, indent=0)
print('aligned', len(out), 'words')
