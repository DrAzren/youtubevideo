"""Write video/excerpt.html: same composition, shifted so [T0, T0+D] renders as [0, D] (for render tests)."""
import re, sys
T0, D = float(sys.argv[1]), float(sys.argv[2])
root = '/home/user/youtubevideo/video/'
h = open(root + 'index.html').read()
def shift(m):
    s = float(m.group(1)); return f'data-start="{max(-9999, s - T0):.3f}"'
h = re.sub(r'data-start="([\d.]+)"', shift, h)
h = re.sub(r'data-composition-id="main" data-start="[-\d.]+"', 'data-composition-id="main" data-start="0"', h)
h = re.sub(r'(data-composition-id="main" data-start="0" data-duration=")[\d.]+', lambda m: m.group(1) + str(D), h)
h = h.replace('window.__timelines["main"] = HF.tl;', f'const __x = gsap.timeline({{ paused: true }}); __x.add(HF.tl.tweenFromTo({T0}, {T0 + D}, {{ ease: "none" }}), 0); window.__timelines["main"] = __x;')
h = h.replace('src="assets/audio/final_mix.wav"', 'src="assets/audio/final_mix.wav" data-media-start="%s"' % T0)
open(root + 'excerpt.html', 'w').write(h)
print('ok')
