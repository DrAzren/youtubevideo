#!/bin/bash
# voice enhancement chain + two-pass loudnorm (-16 LUFS / -1.5 dBTP) for the edited narration
set -e
R=/home/user/youtubevideo/work
CHAIN="highpass=f=75:poles=2,afftdn=nr=5:nf=-55:tn=1,adeclick=w=40:o=75:t=8,equalizer=f=160:t=q:w=1.0:g=1.2,equalizer=f=320:t=q:w=1.2:g=-2.0,equalizer=f=3400:t=q:w=1.4:g=2.2,highshelf=f=9500:g=1.5,deesser=i=0.35:m=0.5:f=0.5:s=o,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=140:makeup=1,alimiter=limit=0.85:attack=3:release=60:level=false"
ffmpeg -hide_banner -loglevel error -y -i $R/narr_edit_raw.wav -af "$CHAIN" -ar 48000 $R/narr_proc.wav
J=$(ffmpeg -hide_banner -i $R/narr_proc.wav -af loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
read mi mtp mlra mth off <<< $(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -hide_banner -loglevel error -y -i $R/narr_proc.wav -af "loudnorm=I=-16:TP=-1.5:LRA=7:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true" -ar 48000 -c:a pcm_s24le $R/narr_clean.wav
ffmpeg -hide_banner -loglevel error -y -i $R/narr_clean.wav -ac 1 -ar 16000 $R/clean16k.wav
