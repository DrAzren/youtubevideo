import sys, json, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=4)
audio, _ = sf.read(sys.argv[1], dtype="float32")
prompt = "Emm, aa, eh, err... jadi, jadi, eh, dia punya... aaa, macam, emm. Skizofrenia, psikiatri."
segs, info = m.transcribe(audio, language="ms", word_timestamps=True, vad_filter=False, beam_size=5,
    initial_prompt=prompt, condition_on_previous_text=False, suppress_tokens=[], temperature=0.0)
res = []
for s in segs:
    res.append({"start": s.start, "end": s.end, "text": s.text,
                "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]})
    print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text}", flush=True)
json.dump(res, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
