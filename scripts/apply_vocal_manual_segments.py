"""Apply user-supplied line times only to the identified recording and lyric text."""
import json, os, re, unicodedata

def normalized(text):
    return re.sub(r'\s+', ' ', re.sub(r'^\s*\d+[.．。]\s*', '', unicodedata.normalize('NFC', text).translate(str.maketrans({'‘':"'",'’':"'",'“':'"','”':'"'})))).strip()

def apply_manual(proofs, root):
    path = os.path.join(root, 'scripts/data/vi_vocal_manual_segments.json')
    if not os.path.exists(path): return
    overrides = json.load(open(path, encoding='utf-8'))
    for key, override in overrides.items():
        proof = proofs[key]
        selected = override.get('selectedRecording')
        if selected and proof['mediaKey'] == override.get('replacesMediaKey'):
            if selected.get('src') != 'pksjj' or selected.get('mediaKey') != 'pub-pksjj_'+key+'_VIDEO':
                raise ValueError('Invalid explicitly selected children recording: '+key)
            for field in ('mediaKey', 'checksum', 'format'):
                if selected[field] != override[field]: raise ValueError('Manual selected recording mismatch: '+key)
            proof.update(selected)
        for field in ('mediaKey', 'checksum', 'format'):
            if proof[field] != override[field]: raise ValueError('Manual timing recording changed: '+key)
        if len(proof['lines']) != len(override['lines']): raise ValueError('Manual timing line count mismatch: '+key)
        end = 0; lines = []
        for index, (existing, supplied) in enumerate(zip(proof['lines'], override['lines'])):
            if normalized(existing['text']) != normalized(supplied['text']): raise ValueError('Manual lyric mismatch: '+key+':'+str(index))
            start, stop = supplied['s'], supplied['e']
            if not isinstance(start, int) or not isinstance(stop, int) or not end <= start < stop <= proof['duration'] * 1000:
                raise ValueError('Invalid manual boundary: '+key+':'+str(index))
            line = {'s':start,'e':stop,'m':index,'pid':None,'text':normalized(supplied['text']), 'enabled':True,'reason':'user_supplied_line_boundaries'}
            # Alternate sung words are separate from the book text used for row matching/TTS.
            if supplied.get('vocalText'):
                if proof['src'] != 'pksjj' or not supplied.get('vocalTextSource'):
                    raise ValueError('Children lyric needs a recording-bound source: '+key+':'+str(index))
                line.update(vocalText=normalized(supplied['vocalText']), vocalTextSource=supplied['vocalTextSource'])
            lines.append(line)
            end = stop
        proof['lines'] = lines
        proof['timingMethod'] = 'user_supplied_same_recording_line_boundaries'
        proof['timingSource'] = override['timingSource']
        proof['manualChildrenOverride'] = override.get('applyLearnerChildren', True) and proof['src'] == 'pksjj'
        proof.pop('model', None)
