import json, sys, os, glob
from playwright.sync_api import sync_playwright
root = '/home/user/youtubevideo/video'
exe = None
for c in glob.glob('/opt/pw-browsers/chromium*/chrome-linux*/chrome') + glob.glob('/opt/pw-browsers/chromium'):
    if os.path.isfile(c): exe = c; break
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script("window.__timelines = window.__timelines || {};")
    pg.goto('file://' + root + '/index.html')
    pg.wait_for_function('window.__SFX && window.__SFX.length > 0', timeout=30000)
    sfx = pg.evaluate('window.__SFX')
    b.close()
print('errors:', errs[:5])
json.dump(sfx, open('/home/user/youtubevideo/work/sfx_cues.json', 'w'), indent=0)
from collections import Counter
print(len(sfx), Counter(s['name'] for s in sfx).most_common())
