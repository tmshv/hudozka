from sync.models import Model
from utils.fn import lmap


def get_id(item):
    try:
        return item.id
    except AttributeError:
        return item['id']


class Sync:
    @staticmethod
    def compile(document):
        return document.bake()

    def __init__(self):
        super().__init__()

        self.collection = None

    async def run(self) -> ([Model], [Model]):
        """
        # Get scope files
        # Validate these files. Raise an error
        # calc_hashes
        # make diff with previous run
        # compile objects
        # upload

        :return:
        """
        return None, None

    async def upload(self):
        pass

    def read(self, document: dict):
        q = {'id': document['id']}
        try:
            return self.collection.find_one(q)
        except ValueError:
            pass
        return None

    def update(self, document: dict):
        query = {'id': document['id']}
        try:
            self.collection.update_one(query, {'$set': document}, upsert=True)
            return self.read(document)
        except ValueError:
            pass
        return None

    def query(self, q):
        return self.collection.find(q)

    def delete(self, q):
        return self.collection.find_one_and_delete(q)

    def create_id(self, document):
        return None

    def create_hash(self, document):
        return None

    def create_remove_query(self, query):
        return query
