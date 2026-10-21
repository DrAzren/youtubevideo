import sys, json
from faster_whisper import WhisperModel
src, out, model_name = sys.argv[1], sys.argv[2], sys.argv[3]
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
import soundfile as sf
audio, _ = sf.read(src, dtype="float32")
segs, info = m.transcribe(audio, language="ms", word_timestamps=True, vad_filter=False,
    beam_size=5, initial_prompt="Sejarah skizofrenia. Emil Kraepelin, Eugen Bleuler, dementia praecox, psikiatri, antipsikotik, klorpromazin.")
res = []
for s in segs:
    d = {"start": s.start, "end": s.end, "text": s.text,
         "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]}
    res.append(d); print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text}", flush=True)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
