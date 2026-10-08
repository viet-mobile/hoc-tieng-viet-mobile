"""Admin song labels generated from the same schedule and titles as student [과정]."""
import json,re
from pathlib import Path
from jeonju_data import JEONJU_SONGS
ROOT=Path(__file__).resolve().parent.parent

def course_songs():
    source=(ROOT/'songs_data.js').read_text(encoding='utf-8')
    marker='const SONGS_DATA = '
    songs,_=json.JSONDecoder().raw_decode(source[source.index(marker)+len(marker):])
    titles={s['number']:s for s in songs}
    result={}
    for week,pair in JEONJU_SONGS.items():
        result[week]=[]
        for kind,label in zip(('open','close'),pair):
            num=int(re.sub(r'^\D+','',label).split()[0]);song=titles[num]
            result[week].append({'kind':kind,'number':num,'text':{lang:song['labels'][lang]+' '+song['title'][lang] for lang in ('ko','vi')}})
    return {'jeonju':result}

def write_course_songs():
    (ROOT/'regional_admin/course_songs.json').write_text(json.dumps(course_songs(),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
