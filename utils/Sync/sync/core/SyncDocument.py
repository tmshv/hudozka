from sync.core import Sync
from sync.data import Provider
from sync.models.Document import Document


class SyncDocument(Sync):
    def __init__(self, provider: Provider, sizes):
        super().__init__(provider, Document)
        self.sizes = sizes

    def _get_build_args(self):
        return {
            'sizes': self.sizes,
        }
