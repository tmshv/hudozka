import os

import settings


def find(store, item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class Model:
    def __init__(self, provider, store, file, params=None):
        super().__init__()

        self.provider = provider
        self.store = store
        self.file = file

        self.origin = None
        self.id = None
        self.url = None
        self.hash = None
        self.ref = None  # Data base reference
        self.params = params if params else {}

        self.init()

    def init(self):
        pass

    async def upload(self, **kwargs):
        pass

    async def build(self, **kwargs):
        pass

    def bake(self):
        return None

    async def is_changed(self):
        i = find(self.store, self.id)
        return self._is_changed_hash(i)

    def has_param(self, name):
        if not self.params:
            return False
        return name in self.params

    def get_param(self, name, default_value=None):
        if not self.params:
            return default_value
        if not (name in self.params):
            return default_value
        return self.params[name]

    def _set_origin(self):
        self.origin = f'{settings.origin}:{os.path.dirname(self.file)}'

    def _is_changed_hash(self, item):
        if not item:
            return True

        if 'hash' not in item:
            return True

        return not (self.hash == item['hash'])

    def _filename(self):
        return os.path.basename(self.file)

    def _get_relpath(self, path):
        folder = self.get_param('folder', self.file)
        return os.path.join(folder, path)

    async def save(self):
        document = self.bake()

        query = {'id': document['id']}
        try:
            self.store.update_one(query, {'$set': document}, upsert=True)
            return self
        except ValueError:
            pass
        return None
