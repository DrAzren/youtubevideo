"""Forced-align a verbatim word list (whisper, including fillers) to the original narration with MMS_FA.
Aligns per whisper segment window so memory stays small; numbers become a wildcard (*) token.
Output: work/aligned_words.json  [{w, s, e, score}] in original-audio seconds."""
import json, re, sys
import torch, torchaudio, soundfile as sf

SR = 16000
audio, sr = sf.read('/home/user/youtubevideo/work/narr16k.wav', dtype='float32')
assert sr == SR
wav = torch.from_numpy(audio)[None]
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=True).eval()
tokenizer = bundle.get_tokenizer()
aligner = bundle.get_aligner()
DICT = bundle.get_dict(star='*')

def norm(w):
    w = w.lower().replace('’', "'")
    if re.search(r'\d', w):
        return '*'
    w = re.sub(r"[^a-z']", '', w)
    return w

segs = json.load(open(sys.argv[1]))
out = []
for si, s in enumerate(segs):
    words = [(w['w'].strip(), w['s'], w['e']) for w in s['words'] if w['w'].strip()]
    toks = [norm(w[0]) for w in words]
    keep = [i for i, t in enumerate(toks) if t]
    if not keep:
        continue
    t0 = max(0.0, s['start'] - 0.6); t1 = min(len(audio) / SR, s['end'] + 0.6)
    chunk = wav[:, int(t0 * SR):int(t1 * SR)]
    with torch.inference_mode():
        em, _ = model(chunk)
    tl = [toks[i] for i in keep]
    try:
        spans = aligner(em[0], tokenizer(tl))
    except Exception as ex:
        print('align fail seg', si, ex); continue
    ratio = chunk.shape[1] / em.shape[1] / SR
    for k, i in enumerate(keep):
        sp = spans[k]
        st = t0 + sp[0].start * ratio; en = t0 + sp[-1].end * ratio
        sc = sum(x.score * len(x) for x in sp) / sum(len(x) for x in sp)
        out.append(dict(w=words[i][0], s=round(st, 3), e=round(en, 3), score=round(float(sc), 3), seg=si))
    print(f'seg {si} {s["start"]:.1f} ok ({len(keep)} words)', flush=True)
json.dump(out, open('/home/user/youtubevideo/work/aligned_words.json', 'w'), ensure_ascii=False, indent=0)
print('words', len(out))
