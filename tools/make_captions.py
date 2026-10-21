import json, re
W=json.load(open('work/words_final.json'))
norm=lambda w: re.sub(r'[^a-z0-9]','',w.lower())
GOLD={'skizofrenia','schizophrenia','kraepelin','emil','eugen','bleuler','dementia','praecox','1908','1911','1952','1900','200','100','psikiatri','halusinasi','delusi','psikosis','schizo','phrenia','greek','jerman','switzerland','19','manicdepressive','relapse','afek','ambivalence','autistik','tamadun','ghaib','moden','diagnosis','minda','pemisahan','membelah','personaliti','mitos','azren','whitecoat','sembuh'}
TEAL={'chlorpromazine','haloperidol','risperidone','olanzapine','quetiapine','aripiprazole','clozapine','antipsikotik','suntikan','psikoterapi','psikoedukasi','psikososial','prolaktin','metabolik'}
lines={}
for i,w in enumerate(W): lines.setdefault(w['li'],[]).append(i)
caps=[]
MAXC=44
for li in sorted(lines):
    idx=lines[li]; cur=[]; clen=0
    for k,i in enumerate(idx):
        w=W[i]['w']
        if cur and (clen+len(w)+1>MAXC):
            caps.append(cur); cur=[]; clen=0
        cur.append(i); clen+=len(w)+1
        # break after punctuation if chunk is reasonably long
        if re.search(r'[,.?!;:]["”]?$',w) and clen>18 and k<len(idx)-1:
            caps.append(cur); cur=[]; clen=0
    if cur: caps.append(cur)
# merge tiny trailing chunks (1 word) into previous if same line & fits
out=[]
for c in caps:
    if out and len(c)==1 and W[c[0]]['li']==W[out[-1][-1]]['li'] and sum(len(W[i]['w'])+1 for i in out[-1])+len(W[c[0]]['w'])<=MAXC+8:
        out[-1]+=c
    else: out.append(c)
C=[]
for j,c in enumerate(out):
    s=W[c[0]]['s']; e=W[c[-1]]['e']+0.35
    if j+1<len(out): e=min(e, W[out[j+1][0]]['s']-0.02)
    ws=[]
    for i in c:
        n=norm(W[i]['w']); hl='g' if n in GOLD else 't' if n in TEAL else ''
        ws.append(dict(w=W[i]['w'],s=round(W[i]['s'],3),h=hl))
    C.append(dict(s=round(s,3),e=round(e,3),w=ws))
open('video/assets/js/captions.js','w').write('window.CAPTIONS='+json.dumps(C,ensure_ascii=False)+';\n')
open('video/assets/js/words.js','w').write('window.WORDS='+json.dumps([[norm(w['w']),w['s'],w['e']] for w in W],ensure_ascii=False)+';\n')
def ts(t):
    h=int(t//3600); m=int(t%3600//60); s=t%60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}".replace(',1000',',999')
with open('deliverables/Sejarah_Skizofrenia_MS.srt','w') as f:
    for j,c in enumerate(C,1):
        f.write(f"{j}\n{ts(c['s'])} --> {ts(c['e'])}\n{' '.join(x['w'] for x in c['w'])}\n\n")
print(len(C),"captions; max len",max(len(' '.join(x['w'] for x in c['w'])) for c in C))
for c in C[:12]: print(c['s'],c['e'],' '.join(x['w'] for x in c['w']))
