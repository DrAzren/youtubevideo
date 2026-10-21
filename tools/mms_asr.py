"""Verbatim CTC transcription (MMS-1b-all, Malay adapter 'zlm'): keeps fillers and repetitions.
Chunks the audio at silences; outputs tokens with start/end times from CTC frames (20 ms)."""
import json, sys, numpy as np, soundfile as sf, torch
from transformers import Wav2Vec2ForCTC, AutoProcessor
torch.set_num_threads(4)
SR = 16000
a, _ = sf.read('/home/user/youtubevideo/work/narr16k.wav', dtype='float32')
proc = AutoProcessor.from_pretrained('facebook/mms-1b-all', target_lang='zlm')
model = Wav2Vec2ForCTC.from_pretrained('facebook/mms-1b-all', target_lang='zlm', ignore_mismatched_sizes=True).eval()
sil = [tuple(map(float, l.split())) for l in open('/home/user/youtubevideo/work/silences.tsv') if len(l.split()) == 2]
# chunk boundaries at silence midpoints, max ~18 s
cuts = [0.0]; last = 0.0
for s, e in sil:
    m = (s + e) / 2
    if m - last > 10 and (e - s) > 0.15:
        cuts.append(m); last = m
cuts.append(len(a) / SR)
vocab = proc.tokenizer.convert_ids_to_tokens(range(model.config.vocab_size))
blank = proc.tokenizer.pad_token_id
out = []
for c0, c1 in zip(cuts[:-1], cuts[1:]):
    x = a[int(c0 * SR):int(c1 * SR)]
    inp = proc(x, sampling_rate=SR, return_tensors='pt')
    with torch.inference_mode():
        lg = model(**inp).logits[0]
    ids = lg.argmax(-1).numpy()
    fr = (c1 - c0) / len(ids)
    word, ws, we = '', None, None
    prev = -1
    for i, t in enumerate(ids):
        if t != blank and t != prev:
            ch = vocab[t]
            if ch == '|':
                if word: out.append(dict(w=word, s=round(c0 + ws * fr, 3), e=round(c0 + (we + 1) * fr, 3)))
                word, ws = '', None
            else:
                if ws is None: ws = i
                word += ch; we = i
        elif t != blank and t == prev and ws is not None:
            we = i
        prev = t
    if word: out.append(dict(w=word, s=round(c0 + ws * fr, 3), e=round(c0 + (we + 1) * fr, 3)))
    print(f'{c0:7.2f}-{c1:7.2f}', ' '.join(o['w'] for o in out if o['s'] >= c0), flush=True)
json.dump(out, open('/home/user/youtubevideo/work/mms_tokens.json', 'w'), ensure_ascii=False, indent=0)
