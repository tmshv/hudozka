def find(store, item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class Model:
    def __init__(self, provider, store, file):
        super().__init__()

        self.provider = provider
        self.store = store
        self.file = file

        self.id = None
        self.url = None
        self.hash = None

        self.init()

    def init(self):
        pass

    def bake(self):
        return None

    async def is_changed(self):
        i = find(self.store, self.id)
        return self._is_changed_hash(i)

    def _is_changed_hash(self, item):
        if not item:
            return True

        if 'hash' not in item:
            return True

        return not (self.hash == item['hash'])

    async def save(self):
        pass
