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
    client = get_provider(settings.sync_provider_type, settings.dir_documents)
    main(client, sync_documents, settings.collection_documents)

    client = get_provider(settings.sync_provider_type, settings.dir_schedules)
    main(client, sync_schedules, settings.collection_schedules)

    client = get_provider(settings.sync_provider_type, settings.dir_events)
    main(client, sync_posts, settings.collection_events)
