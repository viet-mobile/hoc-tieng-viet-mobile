"""GENERAL uses the existing engine CLI/models/manifests, with source-backed rules."""
import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from jw_extraction.engine import ExtractionEngine
from jw_extraction.adapters import get_all_adapters
from jw_extraction.adapters.general_pdf_adapter import GeneralPdfAdapter, ROOT
from jw_extraction.normalization import normalize_text
from jw_extraction.sentence_selector import SentenceSelector


class GeneralEngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = ExtractionEngine(profile="general")
        cls.docs = cls.engine.extract_all_documents()
        cls.output = cls.engine.general_output(cls.docs)

    def test_adapter_models_and_source_isolation(self):
        self.assertEqual([a.source_type for a in get_all_adapters('general')], ['general_vietnamese_pdf'])
        self.assertEqual(len(self.docs), 6)
        self.assertEqual(sum(len(d.segments) for d in self.docs), 1702)
        for doc in self.docs:
            self.assertEqual(doc.profile, 'general')
            for segment in doc.segments:
                self.assertEqual(segment.texts['original'], normalize_text(segment.metadata['original']))
                self.assertEqual(segment.documentId, doc.id)
                self.assertEqual(segment.sectionId, 'page:' + str(segment.metadata['page']))
        foreign = copy.deepcopy(self.docs[0])
        foreign.profile = 'jw'
        with self.assertRaisesRegex(ValueError, 'Non-GENERAL'):
            self.engine.general_output([foreign])

    def test_word_sentence_grammar_source_relationship(self):
        data = self.output['learningData']
        word = data['words'][0]
        sentence = data['sentences'][0]
        self.assertEqual(word['vi'], 'chào')  # actual labelled gloss on source page 19
        self.assertEqual(sentence['vi'], 'Chào anh.')  # source page 20, A speaker marker removed
        grammar = next(g for g in data['grammar'] if sentence['id'] in g['examples'])
        self.assertIn(sentence['vi'], grammar['original'])
        self.assertIn(sentence['translations']['ko'], grammar['original'])
        self.assertEqual(sentence['sources'][0]['segmentId'], grammar['sources'][0]['segmentId'])
        self.assertTrue(grammar['title'])
        self.assertEqual(set(sentence['translations']), {'ko'})

    def test_context_and_sense_aware_deduplication(self):
        original = self.output['learningData']['sentences'][0]
        value = {k: v for k, v in original.items() if k not in ('id', 'sources')}
        another_context = dict(value, context='different-source-context')
        another_sense = dict(value, translations={})
        source = original['sources'][0]
        second = dict(source, line=999)
        rows = SentenceSelector.consolidate_exact([(value, source), (value, second),
                                                   (another_context, source), (another_sense, source)], 'test-')
        self.assertEqual(len(rows), 3)
        self.assertEqual(rows[0]['sources'], [source, second])

    def test_validation_rejects_corruption_and_leakage(self):
        mutations = [
            lambda o: o['learningData']['words'][0].update(vi=''),
            lambda o: o['learningData']['words'][0].update(vi='Giê-hô-va'),
            lambda o: o['learningData']['words'][0].update(category='invalid'),
            lambda o: o['learningData']['words'][0].update(sources=[]),
            lambda o: o['learningData']['words'][0]['sources'][0].update(segmentId='jw_unknown'),
            lambda o: o['learningData']['words'][0]['sources'][0].update(page=99999),
            lambda o: o['learningData']['words'].append(o['learningData']['words'][0]),
            lambda o: o.update(learningData={'invalid': []}),
            lambda o: o.update(profile='jw'),
        ]
        self.assertTrue(self.engine.validate_general_output(self.output)['isValid'])
        for mutate in mutations:
            bad = copy.deepcopy(self.output)
            mutate(bad)
            self.assertFalse(self.engine.validate_general_output(bad, expected=self.output)['isValid'])

    def test_dry_run_rebuild_incremental_and_byte_idempotence(self):
        jw_path = ROOT / 'jw_extraction/data/derived_jw_data.json'
        jw_before = jw_path.read_bytes()
        with tempfile.TemporaryDirectory() as tmp:
            engine = ExtractionEngine(data_dir=tmp, profile='general')
            dry = engine.run_pipeline('dry-run')
            self.assertTrue(dry['outputChanged'])
            self.assertEqual(list(Path(tmp).iterdir()), [])
            engine.run_pipeline('rebuild')
            files = {p.name: p.read_bytes() for p in Path(tmp).iterdir()}
            engine.run_pipeline('rebuild')
            self.assertEqual(files, {p.name: p.read_bytes() for p in Path(tmp).iterdir()})
            self.assertFalse(engine.run_pipeline('incremental')['outputChanged'])
            self.assertTrue(engine.validate()['isValid'])
            self.assertEqual(engine.load_general_output(), self.output)
            # A modified translation/layout is detected even if normalized text is unchanged.
            changed = copy.deepcopy(self.docs)
            changed[0].hash = 'changed'
            with patch.object(engine, 'extract_all_documents', return_value=changed):
                self.assertEqual(engine.run_pipeline('dry-run')['changedDocuments'], [changed[0].id])
        self.assertEqual(jw_before, jw_path.read_bytes())

    def test_adapter_rejects_broken_page_references(self):
        corpus = json.loads((ROOT / 'vietnamese_pdf_corpus.json').read_text(encoding='utf-8'))
        page = corpus['pages'][0]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'vietnamese_pdf_corpus.json').write_text(json.dumps({'metadata': {'sources': [page['source']]}, 'pages': [page]}), encoding='utf-8')
            for name in ['grammar_from_pdfs.json', 'daily_conversations.json', 'vietnam_culture_from_pdfs.json']:
                (root / name).write_text(json.dumps({'items': []}), encoding='utf-8')
            adapter = GeneralPdfAdapter(root)
            before = adapter.extract_documents()[0]
            changed = dict(page, text=page['text'] + '\n')
            (root / 'vietnamese_pdf_corpus.json').write_text(json.dumps({'metadata': {'sources': [page['source']]}, 'pages': [changed]}), encoding='utf-8')
            self.assertNotEqual(before.hash, adapter.extract_documents()[0].hash)
            (root / 'grammar_from_pdfs.json').write_text(json.dumps({'items': [dict(page, page=99999)]}), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'references'):
                adapter.extract_documents()


if __name__ == '__main__':
    unittest.main()
