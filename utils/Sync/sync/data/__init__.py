import os
from io import BytesIO


class Provider:
    def __init__(self, root):
        super().__init__()
        self.root = root

    def read(self, path):
        return BytesIO(bytes())

    def scan(self, path):
        return []

    def glob(self, pattr):
        return []

    def type_filter(self, path, ext):
        return []

    def copy(self, path, out):
        pass

    def hash(self, path):
        return None

    def size(self, path):
        return 0

    def get_abs(self, path):
        abs = os.path.join(self.root, path)
        return os.path.normpath(abs)

    def get_rel(self, path):
        rel = os.path.relpath(path, self.root)
        return rel

    def is_dir(self, path):
        return False