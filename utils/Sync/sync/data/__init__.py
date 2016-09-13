import os
from io import BytesIO

from utils.fn import combine, lmap


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
        a = os.path.join(self.root, path)
        return os.path.normpath(a)

    def get_rel(self, path):
        rel = os.path.relpath(path, self.root)
        return rel

    def is_dir(self, path):
        return False


def scan_subdirs(provider, ext, path='.'):
    """
    Creates flat list of files with specific ext
    It iterates only one level of sub directories
    :param provider: instance of Provider
    :param ext: file extension like .jpg of .pdf for file filtering
    :param path: optional path prefix
    :return: list of files relative to provider.root
    """
    items = provider.scan(path)
    items = list(filter(
        lambda i: provider.is_dir(i),
        items
    ))

    items = lmap(
        lambda folder: provider.type_filter(folder, ext),
        items
    )

    items = combine(items)
    return items


def get_data(provider, path, transform):
    data = provider.read(path)
    return transform(data)
