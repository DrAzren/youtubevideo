import sys, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=4)
audio, sr = sf.read(sys.argv[1], dtype="float32")
for rng in sys.argv[2:]:
    a,b = map(float, rng.split(":"))
    clip = audio[int(a*sr):int(b*sr)]
    segs,_ = m.transcribe(clip, language="ms", word_timestamps=True, beam_size=5, condition_on_previous_text=False, initial_prompt="Psikiatri, skizofrenia.")
    print("==", rng)
    for s in segs:
        print("  ", " ".join(f"{w.word.strip()}@{a+w.start:.2f}-{a+w.end:.2f}({w.probability:.2f})" for w in s.words))
