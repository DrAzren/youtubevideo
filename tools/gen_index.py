"""Generate plan.js (scene timing anchored to narration words) and index.html from the template."""
import json, re, sys
ROOT = '/home/user/youtubevideo/'
W = json.load(open(ROOT + 'work/words_final.json'))
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
N = [norm(w['w']) for w in W]

def at(ph, n=1):
    p = [norm(x) for x in ph.split()]
    c = 0
    for i in range(len(N)):
        if N[i:i + len(p)] == p:
            c += 1
            if c == n:
                return W[i]['s']
    raise SystemExit('anchor not found: ' + ph)

DURATION = 489.0
AUDIO = sys.argv[1] if len(sys.argv) > 1 else 'assets/narration_clean.wav'
UHD = '--uhd' in sys.argv

# (id, anchor phrase or time, chapter-number, chapter-label, theme)
SCENES = [
    ('s01', 0.0, 'I', 'Bayangkan', 'hist'),
    ('s02', 'anda cuba beritahu', None, None, 'hist'),
    ('s03', 'sedangkan', None, None, 'hist'),
    ('s04', 'jom kita balik sejarah', 'II', 'Zaman Tamadun', 'hist'),
    ('s05', 'waktu zaman dulu', None, None, 'hist'),
    ('s06', 'tapi penting', None, None, 'hist'),
    ('s07', 'jom kita balik dekat', 'III', 'Abad ke-19', 'hist'),
    ('s08', 'kraepelin ni kemudian', None, None, 'hist'),
    ('s09', 'tapi kemudian para', None, None, 'hist'),
    ('s10', 'kemudian muncul lagi', 'IV', 'Istilah Baru', 'hist'),
    ('s11', 'bahasa schizophrenia', None, None, 'hist'),
    ('s12', 'tapi jangan salah', None, None, 'hist'),
    ('s13', 'bleuler dia menggunakan', None, None, 'hist'),
    ('s14', 'konsep ni kemudian', 'V', 'Kefahaman Hari Ini', 'modern'),
    ('s15', 'sekarang kita cuba', 'VI', 'Rawatan Awal 1900-an', 'hist'),
    ('s16', 'rawatan waktu tu pula', None, None, 'hist'),
    ('s17', 'dan kemudian tibalah', 'VII', '1952: Titik Perubahan', 'modern'),
    ('s18', 'kemudian muncul pula ubat', None, None, 'modern'),
    ('s19', 'dan apabila research', 'VIII', 'Rawatan Moden', 'modern'),
    ('s20', 'ada yang boleh menyebabkan kenaikan', None, None, 'modern'),
    ('s21', 'dan hari ini ada juga', None, None, 'modern'),
    ('s22', 'rawatan skizofrenia ini', 'IX', 'Pemulihan', 'modern'),
    ('s23', 'saya juga ada menerbitkan', None, None, 'modern'),
    ('s24', 'dan kalau anda', None, None, 'modern'),
]
LEAD, OVERLAP = 0.35, 0.8
starts = []
for sid, a, *_ in SCENES:
    t = a if isinstance(a, float) else max(0.0, at(a) - LEAD)
    starts.append(round(t, 3))
plan = {'duration': DURATION, 'scenes': []}
for i, (sid, a, cn, cl, theme) in enumerate(SCENES):
    s = starts[i]
    e = (starts[i + 1] + OVERLAP) if i + 1 < len(SCENES) else DURATION
    plan['scenes'].append(dict(id=sid, start=s, end=round(e, 3), chapter=cn, label=cl, theme=theme))

VIDEOS = [  # id, src, start, duration, scene index (for stacking)
    ('v1', 'assets/vid/v1_turn.mp4', round(at('anda toleh') - 0.45, 3), 7.95, 0),
    ('v4', 'assets/vid/v4_family.mp4', round(at('anda cuba beritahu') - 0.35, 3), 7.95, 1),
    ('v2', 'assets/vid/v2_write.mp4', round(at('dia mula mengkaji') - 0.4, 3), 6.75, 6),
    ('v3', 'assets/vid/v3_walk.mp4', round(at('matlamat') - 0.3, 3), 9.15, 21),
]
plan['videos'] = {v[0]: dict(src=v[1], start=v[2], dur=v[3], scene=v[4]) for v in VIDEOS}
open(ROOT + 'video/assets/js/plan.js', 'w').write('window.PLAN=' + json.dumps(plan, ensure_ascii=False) + ';\n')

parts = []
for i, sc in enumerate(plan['scenes']):
    d = round(sc['end'] - sc['start'], 3)
    parts.append(f'      <div id="{sc["id"]}" class="clip scene" data-start="{sc["start"]}" data-duration="{d}" data-track-index="1" style="z-index:{10 + 2 * i}"></div>')
    parts.append(f'      <div id="{sc["id"]}-fx" class="clip scene fx" data-start="{sc["start"]}" data-duration="{d}" data-track-index="3" style="z-index:{70 + i}"></div>')
for vid, src, st, du, si in VIDEOS:
    parts.append(f'      <div id="{vid}-wrap" class="vwrap" style="z-index:{11 + 2 * si}"><video id="{vid}" class="clip" src="{src}" muted playsinline data-start="{st}" data-duration="{du}" data-track-index="2"></video></div>')
html = open(ROOT + 'video/src/template.html').read()
if UHD:  # native 3840x2160 canvas: the 1920x1080 stage is scaled 2x so text and vectors rasterize at full UHD
    html = html.replace('data-width="1920" data-height="1080"', 'data-width="3840" data-height="2160"')
    html = html.replace('width=1920, height=1080', 'width=3840, height=2160')
    html = html.replace('html, body { width: 1920px; height: 1080px;', 'html, body { width: 3840px; height: 2160px;')
    html = html.replace('{{SCENES}}', '      <div id="stage" style="position:absolute;left:0;top:0;width:1920px;height:1080px;transform:scale(2);transform-origin:0 0;overflow:hidden">\n{{SCENES}}')
    html = html.replace('      <audio id="mix"', '      </div>\n      <audio id="mix"')
html = html.replace('{{SCENES}}', '\n'.join(parts)).replace('{{DURATION}}', str(DURATION)).replace('{{AUDIO}}', AUDIO)
open(ROOT + 'video/index.html', 'w').write(html)
for sc in plan['scenes']:
    print(sc['id'], sc['start'], sc['end'], sc['label'] or '')
print(plan['videos'])
