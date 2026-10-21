"""Character-level CTC spikes (MMS zlm) for short windows: prints each char with its time."""
import sys, numpy as np, soundfile as sf, torch
from transformers import Wav2Vec2ForCTC, AutoProcessor
SR = 16000
a, _ = sf.read('/home/user/youtubevideo/work/clean16k.wav', dtype='float32')
proc = AutoProcessor.from_pretrained('facebook/mms-1b-all', target_lang='zlm')
model = Wav2Vec2ForCTC.from_pretrained('facebook/mms-1b-all', target_lang='zlm', ignore_mismatched_sizes=True).eval()
vocab = proc.tokenizer.convert_ids_to_tokens(range(model.config.vocab_size)); blank = proc.tokenizer.pad_token_id
def env(t0, t1):
    x = a[int(t0*SR):int(t1*SR)]; h = int(0.01*SR)
    return [20*np.log10(np.sqrt(np.mean(x[i:i+h]**2))+1e-9) for i in range(0, len(x)-h, h)]
for rng in sys.argv[1:]:
    c0, c1 = map(float, rng.split(':'))
    x = a[int(c0*SR):int(c1*SR)]
    with torch.inference_mode():
        ids = model(**proc(x, sampling_rate=SR, return_tensors='pt')).logits[0].argmax(-1).numpy()
    fr = (c1-c0)/len(ids); prev=-1; out=[]
    for i,t in enumerate(ids):
        if t!=blank and t!=prev: out.append(f"{vocab[t]}@{c0+i*fr:.2f}")
        prev=t
    print('==', rng); print('  ', ' '.join(out))
    e = env(c0, c1); print('   env(10ms):', ' '.join(f"{c0+i*0.01:.2f}:{v:.0f}" for i,v in enumerate(e) if v < -30))
