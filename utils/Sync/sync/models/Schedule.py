import logging

from toml import loads as toml_str
from yaml import load as yaml

import settings
from db import collection
from sync.data import Provider, get_data
from sync.models import Model

from utils.fn import constant

logger = logging.getLogger(settings.name + '.Person')
store = collection(settings.collection_schedules)


def find(item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class Schedule(Model):
    @staticmethod
    async def scan(provider):
        documents = provider.type_filter('.', '.yaml')
        documents += provider.type_filter('.', '.toml')

        documents = [Schedule.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        params = get_manifest(provider, path)

        return Schedule(
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
        doc_id = self.params['id'] if 'id' in self.params and self.params['id'] else None
        if not doc_id:
            period = self.__get_period()
            doc_id = 'schedule-{period}-{semester}'.format(period=period, semester=self.params['semester'])
        self.id = doc_id

    def __set_hash(self):
        self.hash = self.provider.hash(self.file)

    def __get_period(self):
        value = self.params['period']
        if isinstance(value, str):
            return value

        if isinstance(value, list):
            return '-'.join(list(map(str, value)))

    def __str__(self):
        return '<Schedule hash={} file={} id={}>'.format(self.hash, self.file, self.id)


def combine(fns):
    def call(value):
        data = value.read()
        for f in fns:
            try:
                return f(data)
            except Exception as e:
                pass
        return None

    return call


def toml(bytes_value):
    s = bytes_value.decode('utf-8')
    return toml_str(s)


def get_manifest(provider: Provider, path: str) -> dict:
    transform = combine([yaml, toml, constant({})])
    manifest = get_data(provider, path, transform)

    return {
        'file': path,
        **manifest,
    }
