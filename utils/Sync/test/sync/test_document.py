import unittest

import settings
from sync.data import scan_subdirs
from sync.data.fs import FSProvider
from sync.document import create_document
from sync.models.Document import Document
from utils.fn import lmap


class MyTestCase(unittest.TestCase):
    def test_document(self):
        p = FSProvider(settings.dir_documents)

        documents = scan_subdirs(p, '.pdf')
        # documents = lmap(
        #     lambda document: create_document(p, document),
        #     documents
        # )

        self.assertEqual(True, True)

    def test_scan(self):
        p = FSProvider(settings.dir_documents)
        documents = scan_subdirs(p, '.pdf')
        self.assertIsInstance(documents, list)


if __name__ == '__main__':
    unittest.main()
