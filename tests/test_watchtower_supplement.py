import re
import unittest
from watchtower_vocab_data import WATCHTOWER_VOCAB, _WT_SUPPLEMENT
from rhyme_data import RHYME_GROUPS

class VocabularyFixes(unittest.TestCase):
    def test_vietnamese_headers(self):
        self.assertTrue(all(g['final_class'].get('vi') for g in RHYME_GROUPS))
        self.assertTrue(all('tháng' in w['date_range']['vi'] for w in WATCHTOWER_VOCAB))
        self.assertEqual(WATCHTOWER_VOCAB[17]['date_range']['vi'], '28 tháng 12 năm 2026–3 tháng 1 năm 2027')

    def test_supplements(self):
        for w in WATCHTOWER_VOCAB[-4:]:
            self.assertEqual(len(w['words']),50)
            self.assertEqual(len({x['vi'].lower() for x in w['words']}),50)
            additions=_WT_SUPPLEMENT[str(w['week'])]
            originals=w['words'][:-len(additions)]
            for x in additions:
                self.assertTrue(re.search(r'(?<!\w)'+re.escape(x['vi'])+r'(?!\w)',x['example'].lower()))
                self.assertTrue(x['mean']['ko'])
                self.assertTrue(any(r['example']==x['example'] and r['example_mean']==x['example_mean'] for r in originals))

if __name__=='__main__':unittest.main()
