"""Build edit decision list from speech islands, then render the edited narration.
Cuts only inside detected silences (or verified sub-island dips), so no word is clipped."""
import json, re, numpy as np, soundfile as sf
ISL=[]
for line in open('work/islands.txt'):
    m=re.match(r'\s*(\d+)\s+([\d.]+)-\s*([\d.]+)\s+\(([\d.]+)\)\s*(.*)',line)
    ISL.append(dict(i=int(m[1]),s=float(m[2]),e=float(m[3]),txt=m[5].strip()))
REMOVE=set(range(0,6))|set(range(89,95))|{157,165,203,204}|set(range(175,184))|set(range(225,230))|set(range(246,250))
# verified sub-island trims: (island, new_start, new_end)
TRIM={151:(307.43,None),153:(None,313.21),164:(None,344.07)}
# breath/noise islands (no words, noisy): dropped
NOISE={1,5,38,56,86,98,149,150,163,167,188,209,210,211,247,248,262}
SECTION_BREAK_BEFORE={205:0.30,33:0.75,65:0.9,104:0.8,151:0.9,184:0.8,212:0.7,236:0.6,250:0.8,260:0.6}
keep=[]
for d in ISL:
    if d['i'] in REMOVE or d['i'] in NOISE or d['e']-d['s']<0.015: continue
    s,e=d['s'],d['e']
    if d['i'] in TRIM:
        ns,ne=TRIM[d['i']]; s=ns or s; e=ne or e
    keep.append(dict(i=d['i'],s=s,e=e,txt=d['txt']))
a,sr=sf.read('assets/src/narration_original.mp3' if False else 'work/narr_orig48k.wav')
if a.ndim==1: a=a[:,None]
out=[]; edl=[]; t_new=0.6  # 0.6s lead-in
out.append(np.zeros((int(0.6*sr),a.shape[1])))
HPRE,HPOST,FADE=0.035,0.06,0.012
prev=None
for k,d in enumerate(keep):
    if prev is not None:
        og=d['s']-prev['e']
        ptxt=prev['txt']
        if d['i'] in SECTION_BREAK_BEFORE: tgt=SECTION_BREAK_BEFORE[d['i']]
        elif re.search(r'[.?!]$',ptxt): tgt=0.48
        elif re.search(r',$',ptxt): tgt=0.30
        else: tgt=0.20
        # removed material in between -> use target; otherwise only shorten
        removed_between=any(x['i'] in REMOVE for x in ISL if prev['i']<x['i']<d['i']) or prev['i']==d['i']
        gap=tgt if removed_between else min(og,tgt) if og>tgt else og
        gap=max(gap,0.06)
        sil=gap-(HPRE+HPOST)
        if sil>0: out.append(np.zeros((int(sil*sr),a.shape[1]))); t_new+=sil
        else: pass
    s=max(0,d['s']-HPRE); e=d['e']+HPOST
    if prev is not None: s=max(s,prev['e']+0.005)
    if k+1<len(keep): e=min(e,keep[k+1]['s']-0.005)
    seg=a[int(s*sr):int(e*sr)].copy()
    n=int(FADE*sr); r=np.linspace(0,1,n)[:,None]
    seg[:n]*=r; seg[-n:]*=r[::-1]
    edl.append(dict(island=d['i'],src_s=round(s,3),src_e=round(e,3),dst_s=round(t_new,3),dst_e=round(t_new+(e-s),3),speech_src=[d['s'],d['e']],txt=d['txt']))
    out.append(seg); t_new+=len(seg)/sr; prev=d
out.append(np.zeros((int(1.2*sr),a.shape[1]))); t_new+=1.2
y=np.concatenate(out)
sf.write('work/narr_edit_raw.wav',y,sr,subtype='PCM_24')
json.dump(edl,open('work/edl.json','w'),ensure_ascii=False,indent=1)
print(f"kept {len(keep)} islands, new duration {len(y)/sr:.2f}s (orig {len(a)/sr:.2f}s)")
