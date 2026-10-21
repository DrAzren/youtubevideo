import json, re, difflib, bisect
norm=lambda w: re.sub(r'[^a-z0-9]','',w.lower())
old=json.load(open('work/edl_v1.json')); new=json.load(open('work/edl.json'))
om={d['island']:d for d in old}; nm={d['island']:d for d in new}
def remap(t):
    for d in old:
        if d['dst_s']-0.25<=t<=d['dst_e']+0.25:
            return t-d['dst_s']+nm[d['island']]['dst_s']
    return None
clean=json.load(open('work/transcript_clean.json'))
gw=[]
for s in clean:
    for w in s['words']:
        if not norm(w['w']): continue
        a=remap(w['s']); b=remap(w['e'])
        if a is None: a=w['s']+ (gw[-1]['d'] if gw else 0)
        if b is None: b=a+(w['e']-w['s'])
        gw.append(dict(n=norm(w['w']),s=a,e=b,d=a-w['s']))
# speech spans in new timeline
spans=[(d['dst_s']+ (d['speech_src'][0]-d['src_s']), d['dst_s']+(d['speech_src'][1]-d['src_s'])) for d in new]
starts=[s for s,_ in spans]
def clamp(t):
    i=bisect.bisect_right(starts,t)-1
    if i<0: return spans[0][0]
    s,e=spans[i]
    if t<=e: return max(t,s)
    return spans[i+1][0] if i+1<len(spans) else t
lines=[l.strip() for l in open('work/script_corrected.txt') if l.strip()]
toks=[]
for li,l in enumerate(lines):
    for w in l.split():
        # split hyphen compounds only for matching purposes
        toks.append(dict(w=w,li=li,parts=[norm(p) for p in re.split(r'-',w) if norm(p)] or [norm(w)]))
flat=[]; owner=[]
for ti,t in enumerate(toks):
    for p in t['parts']: flat.append(p); owner.append(ti)
G=[g['n'] for g in gw]
sm=difflib.SequenceMatcher(a=flat,b=G,autojunk=False)
ft=[None]*len(flat)
for op,a1,a2,b1,b2 in sm.get_opcodes():
    if op=='equal':
        for k in range(a2-a1): ft[a1+k]=(gw[b1+k]['s'],gw[b1+k]['e'])
    elif op=='replace':
        s0=gw[b1]['s']; e0=gw[b2-1]['e']; n=a2-a1
        for k in range(n): ft[a1+k]=(s0+(e0-s0)*k/n, s0+(e0-s0)*(k+1)/n)
# interpolate insertions
for i in range(len(ft)):
    if ft[i] is None:
        j=i
        while j<len(ft) and ft[j] is None: j+=1
        ps=ft[i-1][1] if i>0 else 0.6
        ne=ft[j][0] if j<len(ft) else ps+0.4*(j-i)
        n=j-i
        for k in range(n): ft[i+k]=(ps+(ne-ps)*k/n, ps+(ne-ps)*(k+1)/n)
out=[]
for ti,t in enumerate(toks):
    idx=[i for i,o in enumerate(owner) if o==ti]
    s=clamp(ft[idx[0]][0]); e=max(ft[idx[-1]][1], s+0.08)
    out.append(dict(w=t['w'],s=round(s,3),e=round(e,3),li=t['li']))
for i in range(1,len(out)):
    if out[i]['s']<out[i-1]['s']: out[i]['s']=out[i-1]['s']
json.dump(out,open('work/words_final.json','w'),ensure_ascii=False,indent=0)
print(len(out),"tokens; ratio",round(sm.ratio(),3))
for li in range(len(lines)):
    ws=[o for o in out if o['li']==li]
    print(f"{ws[0]['s']:7.2f}-{ws[-1]['e']:7.2f} {lines[li][:90]}")
