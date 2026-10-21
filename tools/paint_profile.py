import time, sys, glob, os
from playwright.sync_api import sync_playwright
root = '/home/user/youtubevideo/video'
exe = glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome')[0]
TIMES = [5, 15, 24, 33, 45, 64, 71, 90, 106, 134, 150, 170, 193, 214, 245, 268, 299, 316, 333, 378, 411, 443, 464, 485]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.add_init_script("window.__timelines = window.__timelines || {};")
    pg.goto('file://' + root + '/index.html'); pg.wait_for_function('window.__SFX && window.__SFX.length>0')
    pg.evaluate("""() => { const all=[...document.querySelectorAll('[data-start]')]; window.__vis = (t) => all.forEach(e => { const s=+e.dataset.start, d=+e.dataset.duration; e.style.visibility = (t>=s && t<s+d) ? 'visible' : 'hidden'; }); }""")
    def bench(label, setup=None):
        if setup: pg.evaluate(setup)
        tot = 0; per = []
        for t in TIMES:
            pg.evaluate(f"() => {{ window.__vis({t}); HF.tl.seek({t}); }}")
            t0 = time.time(); pg.screenshot(type='jpeg', quality=80); dt = time.time() - t0
            per.append((t, round(dt, 3))); tot += dt
        print(label, round(tot / len(TIMES), 3), per)
    bench('baseline')
    bench('no-grain', "() => { document.getElementById('grain').style.display='none'; }")
    bench('no-filters', "() => { document.querySelectorAll('*').forEach(e => { if (getComputedStyle(e).filter !== 'none') e.style.filter='none'; }); }")
    b.close()
