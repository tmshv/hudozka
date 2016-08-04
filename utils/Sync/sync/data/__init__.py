import os


class Provider:
    def __init__(self, root):
        super().__init__()
        self.root = root

    def open(self, path, mode):
        return ''

    def scan(self, path):
        return []

    def glob(self, pattr):
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
        return os.path.relpath(path, self.root)