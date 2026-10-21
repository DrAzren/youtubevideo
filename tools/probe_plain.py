import sys, soundfile as sf, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=4)
a,sr=sf.read('work/narr16k.wav', dtype='float32')
pad=np.zeros(int(0.4*sr),dtype='float32')
for rng in sys.argv[1:]:
    s,e=map(float,rng.split(':'))
    clip=np.concatenate([pad,a[int(s*sr):int(e*sr)],pad])
    segs,_=m.transcribe(clip,language="ms",beam_size=5,condition_on_previous_text=False)
    print(rng, "=>", " | ".join(x.text for x in segs))
