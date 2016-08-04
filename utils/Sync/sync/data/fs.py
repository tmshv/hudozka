import os
from glob import glob

from shutil import copyfile

from sync.data import Provider
from utils.hash import hash_file


class FSProvider(Provider):
    def open(self, path, mode):
        return open(self.get_abs(path), mode)

    def scan(self, path):
        return os.scandir(self.get_abs(path))

    def glob(self, pattr):
        return glob(self.get_abs(pattr))

    def hash(self, path):
        return hash_file(self.get_abs(path))

    def copy(self, path, out):
        file = self.get_abs(path)
        return copyfile(file, out)

    def size(self, path):
        file = self.get_abs(path)
        return os.path.getsize(file)

