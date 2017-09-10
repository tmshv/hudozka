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
        return False

    async def save(self):
        pass
