import json
import re
import unittest
from general_pdf_data import ROOT, build_general_pdf, merge_pdf_words, normalize
from site_profiles import RELIGIOUS_FILTER_TERMS, NON_JW_HTML_REMOVALS, JW_ONLY_CONSTS, STRUCTURED_EMPTY_SHAPES


class GeneralPdfTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data, cls.report = build_general_pdf()
        cls.pages = {(p['source'], p['page']): p['text'] for p in json.loads(
            (ROOT / 'vietnamese_pdf_corpus.json').read_text(encoding='utf-8'))['pages']}

    def test_every_record_has_exact_source_evidence(self):
        for kind, records in self.data.items():
            self.assertGreater(len(records), 0)
            self.assertEqual(len(records), len({r['id'] for r in records}))
            for row in records:
                for source in row['sources']:
                    original = self.pages[source['file'], source['page']]
                    if kind == 'grammar':
                        self.assertEqual(row['original'], original)
                    else:
                        self.assertEqual(source['quote'], original.splitlines()[source['line'] - 1])
                        self.assertIn(row['vi'], normalize(source['quote']))
                        self.assertIn(row['translations']['ko'], normalize(source['quote']))
                        self.assertEqual(set(row['translations']), {'ko'})
                for term in RELIGIOUS_FILTER_TERMS:
                    content = row.get('original', row.get('vi', '') + str(row.get('translations', {})))
                    self.assertNotIn(term.casefold(), content.casefold())

    def test_accounting_and_determinism(self):
        self.assertEqual((self.data, self.report), build_general_pdf())
        for kind in self.data:
            stats = self.report[kind]
            self.assertEqual(stats['raw'], stats['normalized'] + len(stats['rejected']))
            self.assertEqual(stats['normalized'], stats['final'] + stats['duplicates'])

    def test_exact_sense_merge_retains_provenance_and_distinct_senses(self):
        row = self.data['words'][0]
        words = [{'vi': row['vi'], 'kr': dict(row['translations']), 'tags': ['기본']},
                 {'vi': row['vi'], 'kr': {'ko': 'different sense'}, 'tags': []}]
        merge_pdf_words(words, [row])
        self.assertEqual(len(words), 2)
        self.assertEqual(words[0]['pdf_sources'], row['sources'])
        self.assertNotIn('pdf_id', words[1])

    def test_general_physical_isolation(self):
        self.assertNotIn('sentence', NON_JW_HTML_REMOVALS['tabs'])
        html = (ROOT / 'dist/index.html').read_text(encoding='utf-8')
        self.assertIn('id="sentence-pdf-pane"', html)
        self.assertIn('const GENERAL_PDF = ', html)
        for pane in ['lff', 'lpd', 'wt', 'lff2', 'lpd2', 'wt2', 'song', 'prayer']:
            self.assertNotIn('id="sentence-' + pane + '-pane"', html)
        for constant in ['JEONJU_INFO', 'ULSAN_INFO', 'REGIONAL_SCHEDULE']:
            self.assertNotIn('const ' + constant, html)
        self.assertFalse((ROOT / 'dist/_worker.js').exists())
        self.assertIn('const JW_EXTRACTION_DATA = null;', html)
        for name in JW_ONLY_CONSTS:
            match = re.search(r'^const ' + name + r' = (.*);$', html, re.MULTILINE)
            self.assertIsNotNone(match, name)
            value = json.loads(match[1])
            if name in STRUCTURED_EMPTY_SHAPES:
                self.assertEqual(value, STRUCTURED_EMPTY_SHAPES[name], name)
            else:
                self.assertIn(value, [[], {}], name)

    def test_all_physical_builds_contain_current_authoritative_pdf_records(self):
        for site in ['general', 'jw', 'jeonju', 'ulsan']:
            path = ROOT / 'dist' / ('' if site == 'general' else site) / 'index.html'
            html = path.read_text(encoding='utf-8')
            match = re.search(r'^const GENERAL_PDF = (.*);$', html, re.MULTILINE)
            self.assertIsNotNone(match, site)
            self.assertEqual(json.loads(match[1]), self.data, site)


if __name__ == '__main__':
    unittest.main()
