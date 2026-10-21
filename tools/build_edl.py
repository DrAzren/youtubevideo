"""Build edit decision list from speech islands, then render the edited narration.
Cuts only inside detected silences (or verified sub-island dips), so no word is clipped."""
import json, re, numpy as np, soundfile as sf
ISL=[]
for line in open('work/islands.txt'):
    m=re.match(r'\s*(\d+)\s+([\d.]+)-\s*([\d.]+)\s+\(([\d.]+)\)\s*(.*)',line)
    ISL.append(dict(i=int(m[1]),s=float(m[2]),e=float(m[3]),txt=m[5].strip()))
REMOVE=set(range(0,6))|set(range(89,95))|{157,165,203,204}|set(range(175,184))|set(range(225,230))|set(range(246,250))
# v2 (MMS verbatim check): non-word sounds / fillers / repeated words
REMOVE|={6,105,139,196,219,223,257}
# verified sub-island trims: (island, new_start, new_end)
TRIM={151:(307.43,None),153:(None,313.21),164:(None,344.07),
      33:(66.43,None),     # "a-" before "Jom"
      242:(512.915,None),  # "a-" before "Matlamat"
      120:(None,251.12)}   # "e…" before "tapi jangan salah faham"
# cuts inside an island: (island, cut_start, cut_end)
INNER={37:[(80.515,81.105)]}  # repeated "zaman" ("direkodkan zaman sejak zaman tamadun")
# breath/noise islands (no words, noisy): dropped
NOISE={1,5,38,56,86,98,149,150,163,167,188,209,210,211,247,248,262}
SECTION_BREAK_BEFORE={121:0.24,205:0.22,33:0.5,65:0.55,104:0.5,151:0.55,184:0.5,212:0.45,236:0.4,250:0.5,260:0.4}
GAP_SENT, GAP_COMMA, GAP_MID = 0.26, 0.15, 0.07
keep=[]
for d in ISL:
    if d['i'] in REMOVE or d['i'] in NOISE or d['e']-d['s']<0.015: continue
    s,e=d['s'],d['e']; hs=he=False
    if d['i'] in TRIM:
        ns,ne=TRIM[d['i']]
        if ns: s,hs=ns,True
        if ne: e,he=ne,True
    if d['i'] in INNER:
        cur=s
        for cs,ce in INNER[d['i']]:
            keep.append(dict(i=d['i'],s=cur,e=cs,txt='',hs=hs if cur==s else True,he=True))
            cur=ce
        keep.append(dict(i=d['i'],s=cur,e=e,txt=d['txt'],hs=True,he=he))
    else:
        keep.append(dict(i=d['i'],s=s,e=e,txt=d['txt'],hs=hs,he=he))
a,sr=sf.read('assets/src/narration_original.mp3' if False else 'work/narr_orig48k.wav')
if a.ndim==1: a=a[:,None]
out=[]; edl=[]; t_new=0.6  # 0.6s lead-in
out.append(np.zeros((int(0.6*sr),a.shape[1])))
HPRE,HPOST,FADE=0.035,0.06,0.012
prev=None; last_txt=''
for k,d in enumerate(keep):
    if prev is not None:
        og=d['s']-prev['e']
        ptxt=prev['txt'] or last_txt
        if d['i'] in SECTION_BREAK_BEFORE: tgt=SECTION_BREAK_BEFORE[d['i']]
        elif re.search(r'[.?!]$',ptxt): tgt=GAP_SENT
        elif re.search(r',$',ptxt): tgt=GAP_COMMA
        else: tgt=GAP_MID
        # removed material in between -> use target; otherwise only shorten
        removed_between=any(x['i'] in REMOVE for x in ISL if prev['i']<x['i']<d['i'])
        if prev['i']==d['i']: tgt=0.0; removed_between=True  # inner cut: butt-join with crossfade
        gap=tgt if removed_between else min(og,tgt) if og>tgt else og
        gap=max(gap,0.06) if prev['i']!=d['i'] else 0.0
        sil=gap-((0 if prev['he'] else HPOST)+(0 if d['hs'] else HPRE))
        if sil>0: out.append(np.zeros((int(sil*sr),a.shape[1]))); t_new+=sil
        else: pass
    s=d['s'] if d['hs'] else max(0,d['s']-HPRE); e=d['e'] if d['he'] else d['e']+HPOST
    if prev is not None and not d['hs']: s=max(s,prev['e']+0.005)
    if k+1<len(keep) and not d['he']: e=min(e,keep[k+1]['s']-0.005)
    seg=a[int(s*sr):int(e*sr)].copy()
    n1=int((0.006 if d['hs'] else FADE)*sr); n2=int((0.006 if d['he'] else FADE)*sr)
    seg[:n1]*=np.linspace(0,1,n1)[:,None]; seg[-n2:]*=np.linspace(1,0,n2)[:,None]
    edl.append(dict(island=d['i'],src_s=round(s,3),src_e=round(e,3),dst_s=round(t_new,3),dst_e=round(t_new+(e-s),3),speech_src=[d['s'],d['e']],txt=d['txt']))
    out.append(seg); t_new+=len(seg)/sr; prev=d
    if d['txt']: last_txt=d['txt']
out.append(np.zeros((int(1.2*sr),a.shape[1]))); t_new+=1.2
y=np.concatenate(out)
sf.write('work/narr_edit_raw.wav',y,sr,subtype='PCM_24')
json.dump(edl,open('work/edl.json','w'),ensure_ascii=False,indent=1)
print(f"kept {len(keep)} islands, new duration {len(y)/sr:.2f}s (orig {len(a)/sr:.2f}s)")
