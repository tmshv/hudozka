from utils.fn import lmap


class Sync:
    def __init__(self):
        super().__init__()

        self.collection = None

    def read(self, document):
        if isinstance(document, list):
            return lmap(self.read, document)

        q = {'id': document['id']}
        try:
            return self.collection.find_one(q)
        except ValueError:
            pass
        return None

    def update(self, document):
        if isinstance(document, list):
            return lmap(self.update, document)

        q = {'id': document['id']}
        try:
            self.collection.update_one(q, {'$set': document}, upsert=True)
            return self.read(document)
        except ValueError:
            pass
        return None

    def compile(self, document):
        return document

    def query(self, q):
        return self.collection.find(q)

    def delete(self, q):
        return self.collection.find_one_and_delete(q)

    def create_id(self, document):
        return None

    def create_hash(self, document):
        return None
