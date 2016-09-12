import unittest

from sync.models import Model


class MyTestCase(unittest.TestCase):
    def test_bake(self):
        m = Model()
        self.assertIsNone(m.bake())


if __name__ == '__main__':
    unittest.main()
