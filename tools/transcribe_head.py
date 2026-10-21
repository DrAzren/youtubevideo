import sys, json, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=4)
audio, _ = sf.read(sys.argv[1], dtype="float32")
segs, _ = m.transcribe(audio, language="ms", word_timestamps=True, beam_size=5, vad_filter=True, condition_on_previous_text=False)
res=[]
for s in segs:
    res.append({"start":s.start,"end":s.end,"text":s.text,"words":[{"w":w.word,"s":w.start,"e":w.end,"p":w.probability} for w in s.words]})
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
json.dump(res, open(sys.argv[2],"w"), ensure_ascii=False, indent=1)
