class Model:
    def __init__(self, create_fn, read_fn, update_fn, delete_fn):
        super().__init__()
        self.update_fn = update_fn
        self.create_fn = create_fn
        self.read_fn = read_fn
        self.delete_fn = delete_fn

    def create(self, document):
        return self.create_fn(document)

    def read(self, query):
        return self.read_fn(query)

    def update(self, query, record):
        return self.update_fn(query)

    def delete(self, query):
        return self.delete_fn(query)