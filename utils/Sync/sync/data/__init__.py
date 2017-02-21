import os
from io import BytesIO

import requests

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

    def exists(self, path):
        return True

    def get_abs(self, path):
        a = os.path.join(self.root, path)
        return os.path.normpath(a)

    def get_rel(self, path):
        rel = os.path.relpath(path, self.root)
        return rel

    def get_local(self, path):
        return path

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


def list_images(provider, path):
    image_types = ['.jpg', '.JPG', '.png', '.PNG']
    return combine(lmap(
        lambda ext: provider.type_filter(path, ext),
        image_types
    ))


def upload(file_path, relative_path):
    """
    /path/to/file, /url/path -> https://static.shlisselburg.org/art/url/path
    :param file_path:
    :param relative_path:
    :return:
    """
    files = {'file': open(file_path, 'rb')}
    url = 'https://static.shlisselburg.org/upload/art{}'.format(relative_path)
    r = requests.put(
        url=url,
        files=files,
        auth=('uploader', '1207690962638465')
    )
    if r.status_code == 200:
        return url
    else:
        return None
