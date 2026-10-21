"""Offline mix: narration (master timing) + music bed (ducked) + SFX cues extracted from the composition.
Writes stems and the final -16 LUFS / -1 dBTP stereo mix at 48 kHz."""
import json, subprocess, os, numpy as np, soundfile as sf
from scipy import signal

R = '/home/user/youtubevideo/'
SR = 48000
import json as _j
_PLAN = _j.loads(open(R + 'video/assets/js/plan.js').read().split('=', 1)[1].rstrip().rstrip(';'))
DUR = _PLAN['duration']
SC = {x['id']: x['start'] for x in _PLAN['scenes']}
N = int(DUR * SR)
rs = np.random.default_rng(2026)

def load(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', str(start), '-i', path]
    if dur: cmd += ['-t', str(dur)]
    cmd += ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

def db(x): return 10 ** (x / 20)

def trim_norm(x, peak=-3.0, thr=-45):
    m = np.abs(x).max(1)
    idx = np.where(m > db(thr))[0]
    if len(idx): x = x[max(0, idx[0] - 48):]
    p = np.abs(x).max() + 1e-9
    return x * (db(peak) / p)

def fade(x, fi=0.005, fo=0.02):
    n1, n2 = int(fi * SR), int(fo * SR)
    if n1: x[:n1] *= np.linspace(0, 1, n1)[:, None]
    if n2: x[-n2:] *= np.linspace(1, 0, n2)[:, None]
    return x

def st(m): return np.stack([m, m], 1)

def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)

def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype='low', fs=SR, output='sos'), x, axis=0)

def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype='high', fs=SR, output='sos'), x, axis=0)

def env(n, a=0.002, d=0.1, curve=6):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * np.maximum(0, t - a) / max(d, 1e-4))
    return e

# ---------------- synthesized one-shots ----------------
def s_pop(p=1.0):
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 520 * p * np.exp(-t * 18) + 240 * p
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * env(n, 0.001, 0.05, 1) * 0.8 + bp(rs.normal(0, 0.15, n), 1500, 6000) * env(n, 0.0005, 0.008, 1)
    return fade(st(y), 0.001, 0.02)

def s_click(p=1.0):
    n = int(0.05 * SR)
    y = bp(rs.normal(0, 1, n), 2500 * p, 9000) * env(n, 0.0003, 0.006, 1) * 0.6
    y += np.sin(2 * np.pi * 1900 * p * np.arange(n) / SR) * env(n, 0.0005, 0.015, 1) * 0.25
    return fade(st(y), 0.0005, 0.01)

def s_ui(p=1.0):
    out = np.zeros((int(0.25 * SR), 2))
    for k, (f, t0) in enumerate([(880 * p, 0), (1320 * p, 0.06)]):
        n = int(0.14 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * f * t) * env(n, 0.003, 0.07, 1) * 0.35
        i = int(t0 * SR); out[i:i + n] += st(y)
    return fade(out, 0.001, 0.03)

def s_swish(d=0.35, lo=900, hi=5000, gain=0.6):
    n = int(d * SR); t = np.arange(n) / SR
    y = bp(rs.normal(0, 1, n), lo, hi) * np.sin(np.pi * t / d) ** 2 * gain
    pan = np.linspace(-0.5, 0.5, n)
    return fade(np.stack([y * (1 - pan) * 0.8, y * (1 + pan) * 0.8], 1), 0.005, 0.05)

def s_whoosh(d=1.0, lo=200, hi=3000, gain=0.6, seed=0):
    r = np.random.default_rng(seed)
    n = int(d * SR); t = np.arange(n) / SR
    x = r.normal(0, 1, n)
    # moving band: sweep the centre frequency up then down
    out = np.zeros(n); blk = 2048
    for i in range(0, n, blk):
        c = lo + (hi - lo) * np.sin(np.pi * min(1, (i / n))) ** 1.5
        seg = x[i:i + blk]
        out[i:i + blk] = bp(seg, max(60, c * 0.5), min(20000, c * 1.6), 1)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    y = out * e * gain
    pan = np.sin(np.linspace(-1.2, 1.2, n)) * 0.6
    return fade(np.stack([y * (1 - pan), y * (1 + pan)], 1), 0.01, 0.1)

def s_sub(d=1.4, f0=58, gain=0.9):
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + 0.6 * np.exp(-t * 10))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, d * 0.35, 1) * gain
    return fade(st(y), 0.002, 0.2)

def s_thump(f0=90, d=0.25, gain=0.8):
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + 1.5 * np.exp(-t * 40))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, d * 0.25, 1) * gain
    y += lp(rs.normal(0, 0.4, n), 1200) * env(n, 0.0005, 0.02, 1)
    return fade(st(y), 0.001, 0.05)

def s_pulse(f=330, d=0.7, am=7, gain=0.4):
    n = int(d * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * (0.5 + 0.5 * np.sin(2 * np.pi * am * t)) * np.sin(np.pi * t / d) * gain
    y = y + 0.4 * np.concatenate([np.zeros(int(0.12 * SR)), y[:-int(0.12 * SR)]])
    return fade(st(y), 0.005, 0.1)

def s_down(d=0.8, gain=0.35):
    n = int(d * SR); t = np.arange(n) / SR
    f = 620 * np.exp(-t * 1.6)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * gain
    return fade(st(y), 0.005, 0.1)

def s_riser(d=3.0, gain=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    noise = hp(rs.normal(0, 1, n), 2000) * (t / d) ** 2 * 0.25
    f = 180 + 520 * (t / d) ** 2
    tone = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)) * (t / d) ** 1.5 * 0.25
    y = (noise + tone) * gain
    return fade(st(y), 0.05, 0.25)

def s_crack(d=0.55, gain=0.8):
    n = int(d * SR); y = np.zeros(n)
    for k in range(26):
        i = int(rs.uniform(0, 0.8) ** 1.8 * n * 0.9)
        m = int(rs.uniform(0.002, 0.012) * SR)
        y[i:i + m] += rs.normal(0, 1, len(y[i:i + m])) * np.exp(-np.arange(len(y[i:i + m])) / (m / 3)) * rs.uniform(0.3, 1)
    y = fade(st(bp(y, 900, 9000) * gain), 0.001, 0.05)
    th = s_thump(70, 0.3, 0.5); y[:len(th)] += th
    return y

def s_tear(d=0.7, gain=0.6):
    n = int(d * SR); t = np.arange(n) / SR
    y = bp(rs.normal(0, 1, n), 1200, 7000) * (0.4 + 0.6 * (rs.random(n) > 0.6)) * np.sin(np.pi * t / d) * gain
    return fade(st(lp(y, 8000)), 0.005, 0.05)

def s_glitch(gain=0.35):
    out = np.zeros((int(0.5 * SR), 2))
    for k in range(6):
        n = int(rs.uniform(0.02, 0.05) * SR); i = int(k * 0.07 * SR)
        f = rs.uniform(400, 1600)
        y = np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR)) * 0.25 * env(n, 0.001, 0.02, 1)
        out[i:i + n] += st(y)
    return fade(out * gain * 2, 0.001, 0.05)

def s_whisper(d=2.2, gain=0.35):
    n = int(d * SR); t = np.arange(n) / SR
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 3.2 * t + 2 * np.sin(2 * np.pi * 0.7 * t))
    y = bp(rs.normal(0, 1, n), 1800, 6500) * am * np.sin(np.pi * t / d) ** 2 * gain
    pan = np.sin(np.linspace(0, 3, n)) * 0.7
    return fade(np.stack([y * (1 - pan), y * (1 + pan)], 1), 0.02, 0.3)

def s_heartbeat(gain=0.7):
    out = np.zeros((int(1.0 * SR), 2))
    for t0, g in [(0, 1), (0.22, 0.7)]:
        th = s_thump(52, 0.3, gain * g); i = int(t0 * SR); out[i:i + len(th)] += th
    return out

# ---------------- library one-shots ----------------
LIB = {}
def lib(name, file, start=0.0, dur=None, peak=-3.0):
    x = load(R + 'video/.media/audio/sfx/' + file, start, dur)
    LIB[name] = fade(trim_norm(x, peak), 0.003, 0.05)

lib('tick', 'sfx_002.mp3')
lib('paper', 'sfx_003.mp3', 0, 4)
lib('page', 'sfx_001.mp3')
lib('page2', 'sfx_009.mp3')
lib('whoosh_d', 'sfx_004.mp3')
lib('whoosh_deep6', 'sfx_005.mp3')
lib('whoosh_deep1', 'sfx_006.mp3')
lib('boom', 'sfx_008.mp3', 0, 3.2)
lib('type', 'sfx_012.mp3')
lib('shimmer', 'sfx_014.mp3', 0, 3.0)
lib('scribble', 'sfx_015.mp3', 0, 1.6)
lib('bookshut', 'sfx_017.mp3')
lib('chime', 'sfx_019.mp3', 0, 3.5)

def seg(x, d, off=0.0):
    i = int(off * SR); n = int(d * SR)
    return fade(x[i:i + n].copy(), 0.01, 0.08)

def resample(x, ratio):
    n = int(len(x) / ratio)
    return signal.resample(x, n, axis=0)

PAPER = LIB['paper']
def make(name, k):
    """k: per-name occurrence counter for variation"""
    v = k % 4
    if name == 'tick': return LIB['tick'] * (0.9 if v % 2 else 1.0)
    if name == 'paper': return seg(PAPER, 0.55, [0.2, 1.1, 2.0, 2.8][v]) * 0.9
    if name == 'scroll': return seg(PAPER, 1.2, 0.6)
    if name == 'page': return LIB['page'] if v % 2 == 0 else LIB['page2']
    if name == 'flip': return resample(seg(LIB['page'], 0.4, 0.1), 1.25) * 0.8
    if name == 'book_open': return LIB['page2'] * 0.9 + np.pad(s_thump(110, 0.2, 0.3), ((0, max(0, len(LIB['page2']) - int(0.2 * SR))), (0, 0)))[:len(LIB['page2'])]
    if name == 'whoosh_soft':
        return [LIB['whoosh_d'] * 0.7, s_whoosh(0.8, 300, 3500, 0.5, k), s_swish(0.45, 700, 4000, 0.55), s_whoosh(1.0, 200, 2500, 0.5, k + 50)][v]
    if name == 'whoosh_long': return [LIB['whoosh_deep6'], LIB['whoosh_deep1'], s_whoosh(2.0, 150, 2200, 0.6, 9)][k % 3] * 0.8
    if name == 'rewind': return np.flipud(LIB['whoosh_deep6']).copy() * 0.8
    if name == 'pop': return s_pop([1.0, 1.12, 0.92, 1.25][v])
    if name == 'pops':
        out = np.zeros((int(1.4 * SR), 2))
        for j in range(8):
            p = s_pop(0.9 + 0.08 * j); i = int(j * 0.11 * SR); out[i:i + len(p)] += p * 0.6
        return out
    if name == 'click': return s_click([1.0, 1.2, 0.9, 1.1][v])
    if name == 'ui': return s_ui([1.0, 1.122, 0.891, 1.26][v])
    if name == 'card': return s_swish(0.3, 1200, 6000, 0.5)
    if name == 'type': return seg(LIB['type'], 0.6, 0.0)
    if name == 'draw': return seg(LIB['scribble'], 1.0, 0.0) * 0.7
    if name == 'accent':
        sub = s_sub(1.6, 55, 0.7); sh = LIB['chime'][:len(sub)] * 0.25
        n = max(len(sub), len(sh)); out = np.zeros((n, 2)); out[:len(sub)] += sub; out[:len(sh)] += sh
        return out
    if name == 'boom':
        b = LIB['boom'] * 0.8; s = s_sub(2.2, 45, 0.6)
        n = max(len(b), len(s)); out = np.zeros((n, 2)); out[:len(b)] += b; out[:len(s)] += s
        return out
    if name == 'book_impact':
        a = LIB['bookshut'] * 0.7; s = s_sub(1.8, 50, 0.6); c = LIB['chime'] * 0.25
        n = max(len(a), len(s), len(c)); out = np.zeros((n, 2)); out[:len(a)] += a; out[:len(s)] += s; out[:len(c)] += c
        return out
    if name == 'shimmer': return LIB['shimmer'] * 0.7
    if name == 'chime': return LIB['chime'] * 0.6
    if name == 'stamp': return s_thump(120, 0.3, 0.9) + np.pad(seg(PAPER, 0.15, 1.5) * 0.6, ((0, int(0.15 * SR)), (0, 0)))[:int(0.3 * SR)]
    if name == 'thud': return LIB['bookshut'] * 0.6
    if name == 'crack': return s_crack()
    if name == 'tear': return s_tear()
    if name == 'split': return s_swish(0.4, 2000, 8000, 0.5)
    if name == 'swipe': return s_swish(0.22, 1500, 7000, 0.6)
    if name == 'lowerthird': return s_swish(0.5, 600, 4000, 0.45)
    if name == 'whisper': return s_whisper()
    if name == 'pulse_low': return s_pulse(160, 1.2, 4, 0.45)
    if name == 'pulse': return s_pulse(440, 0.8, 9, 0.3)
    if name == 'heartbeat': return s_heartbeat(0.7)
    if name == 'glitch_soft': return s_glitch()
    if name == 'build':
        out = np.zeros((int(1.6 * SR), 2))
        for j in range(4):
            th = s_thump(80 + j * 8, 0.25, 0.5); i = int(j * 0.18 * SR); out[i:i + len(th)] += th
        w = s_whoosh(1.2, 200, 2000, 0.4, 77); out[:len(w)] += w
        return out
    if name == 'down': return s_down()
    if name == 'scale': return s_swish(0.7, 300, 2200, 0.35)
    if name == 'riser': return s_riser(3.0, 0.5)
    raise KeyError(name)

# ---------------- build SFX bus ----------------
cues = json.load(open(R + 'work/sfx_cues.json'))
sfx = np.zeros((N + SR * 6, 2))
count = {}
LEVEL = db(-12)  # SFX sit well under the voice
for c in cues:
    k = count.get(c['name'], 0); count[c['name']] = k + 1
    x = make(c['name'], k)
    i = int(max(0, c['t']) * SR)
    sfx[i:i + len(x)] += x * c['gain'] * LEVEL
sfx = sfx[:N]
sfx = lp(hp(sfx, 40), 15000)

# ---------------- narration ----------------
vo_m, sr = sf.read(R + 'work/narr_clean.wav', dtype='float32')
assert sr == SR
vo = np.zeros((N, 2)); vo[:len(vo_m)] = st(vo_m[:N])

# ---------------- music bed ----------------
M = R + 'video/assets/audio/music/'
# music sections follow the story chapters (anchored to scene starts)
_st = [0.0, SC['s04'] + 2.0, SC['s07'] - 3.0, SC['s10'] - 1.7, SC['s15'] - 8.8, SC['s19'] - 2.0, DUR]
_src = [('tyops_doc.mp3', 0.0, 0), ('tyops_cine.mp3', 0.0, 0), ('cinemusic01.mp3', 8.0, -2),
        ('tyops_cine02.mp3', 0.0, -1), ('univ_soft.mp3', 0.0, 0), ('emopiano2.mp3', 0.0, 0)]
SEGS = []  # file, timeline start, source offset, duration, fade in, fade out, gain dB
for k, (f, off, g) in enumerate(_src):
    d = (_st[k + 1] - _st[k]) + (5.0 if k < 5 else 0.0)
    SEGS.append((f, _st[k], off, round(d, 2), 3.0 if k == 0 else 4.0, 5.0 if k < 5 else 4.5, g))
mus = np.zeros((N, 2))
def lufs_gain(x, target=-20.0):
    # quick K-weighted-ish loudness proxy: RMS of high-passed signal
    y = hp(x, 100)
    rms = np.sqrt(np.mean(y ** 2) + 1e-12)
    return db(target - (20 * np.log10(rms) + 0.0))
for f, t0, off, d, fi, fo, g in SEGS:
    x = load(M + f, off, d)
    x = x * lufs_gain(x) * db(g)
    x = fade(x, fi, fo)
    i = int(t0 * SR); mus[i:i + len(x)] += x[:N - i]

# ducking from the voice envelope (smoothed), plus base level
v_env = np.abs(vo_m)
win = int(0.05 * SR)
v_env = np.sqrt(signal.lfilter(np.ones(win) / win, [1], v_env ** 2))
act = (v_env > db(-38)).astype(float)
# attack 60 ms / release 450 ms smoothing
a_att, a_rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR))
sm = np.zeros_like(act); s_ = 0.0
for i in range(0, len(act), 48):  # 1 ms steps
    tgt = act[i]; c = a_att ** 48 if tgt > s_ else a_rel ** 48
    s_ = c * s_ + (1 - c) * tgt; sm[i:i + 48] = s_
duck = np.ones(N); duck[:len(sm)] = 1 - 0.55 * sm[:N]
base = np.full(N, db(-9.5))
# lift the bed in narration-free moments: open, title, end card
for a, b_, lvl in [(0, 1.0, -6), (DUR - 7.4, DUR, -4.5)]:
    i0, i1 = int(a * SR), int(b_ * SR); base[i0:i1] = db(lvl)
base = signal.lfilter([1 - 0.9995], [1, -0.9995], base)  # smooth level changes
mus = mus * (base * duck)[:, None]

# ---------------- master ----------------
sfx = sfx * (1 - 0.3 * (1 - duck) / 0.55)[:, None]  # ~3 dB SFX dip under speech
mix = vo + mus + sfx
sf.write(R + 'deliverables/stems/sfx.wav', sfx.astype(np.float32), SR, subtype='PCM_24')
os.makedirs(R + 'deliverables/stems', exist_ok=True)
sf.write(R + 'work/mix_pre.wav', mix.astype(np.float32), SR, subtype='FLOAT')
sf.write(R + 'deliverables/stems/music_bed.wav', mus.astype(np.float32), SR, subtype='PCM_24')
sf.write(R + 'deliverables/stems/sfx.wav', sfx.astype(np.float32), SR, subtype='PCM_24')
sf.write(R + 'deliverables/stems/narration_clean.wav', vo.astype(np.float32), SR, subtype='PCM_24')
print('peak pre', 20 * np.log10(np.abs(mix).max()))
