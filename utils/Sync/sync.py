from subprocess import call

import settings
from db import db
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider
from sync.document import sync_documents
from sync.post import sync_posts
from sync.schedule import sync_schedules
from utils.fn import lprint_json
from utils.image import read_image
from utils.image import thumbnail


def get_provider(provider_type, root):
    if provider_type == 'fs':
        return FSProvider(root)
    elif provider_type == 'yd':
        return YDProvider(root, settings.yandex_disk_access_token)
    return None


def main(provider, fn, collection_name):
    if provider:
        collection = db()[collection_name]

        print('SYNC: %s' % (collection_name.upper()))
        u, d = fn(provider, collection, update=settings.do_update, delete=settings.do_update)

        print('DELETE %s: %s' % (collection_name.upper(), 'NO' if not settings.do_delete else str(len(d))))
        lprint_json(d)

        print('UPDATE %s: %s' % (collection_name.upper(), 'NO' if not settings.do_update else str(len(u))))
        lprint_json(u)

        print('')


if __name__ == '__main__':
    io = lambda root: get_provider(settings.sync_provider_type, root)

    main(io(settings.dir_documents), sync_documents, settings.collection_documents)
    main(io(settings.dir_schedules), sync_schedules, settings.collection_schedules)
    main(io(settings.dir_events), sync_posts, settings.collection_events)
