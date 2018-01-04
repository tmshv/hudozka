from toml import loads as toml_str
from yaml import load as yaml

import settings
from db import collection
from sync.data import Provider, get_data
from sync.models import Model

from utils.fn import constant

store = collection(settings.collection_settings)


class Settings(Model):
    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

    @staticmethod
    async def scan(provider):
        scan_dir = settings.dir_settings
        documents = provider.type_filter(scan_dir, '.yaml')

        documents = [Settings.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        params = yaml(provider.read(path))

        return Settings(
            provider,
            path,
            params=params,
        )

    def __init__(self, provider, file, params=None):
        super().__init__(provider, store, file, params=params)

    def init(self):
        pass
        self.__set_id()
        self.__set_hash()

    def bake(self):
        return {
            **self.params,
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
        }

    def __set_id(self):
        self.id = 'settings'

    def __set_hash(self):
        self.hash = self.provider.hash(self.file)

    def __str__(self):
        return f'<Settings file={self.file} id={self.id}>'
