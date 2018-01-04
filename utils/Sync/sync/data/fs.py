import os
from glob import glob

from shutil import copyfile

from sync.data import Provider
from utils.hash import hash_file


class FSProvider(Provider):
    def read(self, path):
        return open(self.get_abs(path), 'rb')

    def scan(self, path):
        paths = [i.path for i in os.scandir(self.get_abs(path))]

        return [self.get_rel(path) for path in paths]

    def glob(self, pattr):
        items = glob(self.get_abs(pattr))
        return [self.get_rel(i) for i in items]

    def type_filter(self, path, ext):
        return list(filter(
            lambda fn: os.path.splitext(fn)[1] == ext,
            self.scan(path)
        ))

    def hash(self, path):
        return hash_file(self.get_abs(path))

    def copy(self, path, out):
        file = self.get_abs(path)
        return copyfile(file, out)

    def size(self, path):
        file = self.get_abs(path)
        return os.path.getsize(file)

    def exists(self, path):
        file = self.get_abs(path)
        return os.path.exists(file)

    def is_dir(self, path):
        return os.path.isdir(self.get_abs(path))

    def get_local(self, path):
        return self.get_abs(path)
