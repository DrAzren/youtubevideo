#!/bin/bash
# two-pass loudness normalisation of the pre-mix to -16 LUFS / -1 dBTP
set -e
R=/home/user/youtubevideo
IN=$R/work/mix_pre.wav
J=$(ffmpeg -hide_banner -i $IN -af "alimiter=limit=0.95:attack=2:release=50:level=false,loudnorm=I=-16:TP=-1.2:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p')
I=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
read mi mtp mlra mth off <<< "$I"
ffmpeg -hide_banner -loglevel error -y -i $IN -af "alimiter=limit=0.95:attack=2:release=50:level=false,loudnorm=I=-16:TP=-1.2:LRA=9:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true" -ar 48000 -c:a pcm_s24le $R/video/assets/audio/final_mix.wav
cp $R/video/assets/audio/final_mix.wav $R/deliverables/stems/final_mix.wav
ffmpeg -hide_banner -i $R/video/assets/audio/final_mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
