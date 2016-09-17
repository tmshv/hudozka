import os

import re

import io
from tempfile import mkstemp

import requests

from sync.data import Provider
from utils.fn import lmap
from yandexdisk import YDClient


class YDProvider(Provider):
    def __init__(self, root, access_token):
        super().__init__(root)
        self.api = YDClient(access_token)

    def read(self, path):
        remote = self.api.get_download_link(self.get_abs(path))
        url = remote['href']
        req = requests.get(url)
        data = req.content
        return io.BytesIO(data)

    def scan(self, path):
        res = self.api.get_content(self.get_abs(path))
        files = []
        for item in res.children:
            files.append(item.path)

        files = map(
            lambda fp: re.sub('disk:', '', fp),
            files
        )
        return lmap(self.get_rel, files)

    def glob(self, pattr):
        return []

    def type_filter(self, path, ext):
        return list(filter(
            lambda fn: os.path.splitext(fn)[1] == ext,
            self.scan(path)
        ))

    def hash(self, path):
        res = self.api.get_content(self.get_abs(path))
        return res.sha256

    def copy(self, path, out):
        data = self.read(path)
        f = open(out, 'wb')
        f.write(data.read())
        f.close()
        return out

    def size(self, path):
        res = self.api.get_content(self.get_abs(path))
        return res['size']

    def is_dir(self, path):
        res = self.api.get_content(self.get_abs(path))
        return res.type == 'dir'

    def get_local(self, path):
        ext = os.path.splitext(path)[1]
        _, temp_in = mkstemp(suffix=ext)
        return self.copy(path, temp_in)
