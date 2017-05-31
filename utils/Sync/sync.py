import settings
from db import db, collection
from sync.album import sync_albums
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider
from sync.document import sync_documents
from sync.page import sync_pages
from sync.person import sync_persons
from sync.post import sync_posts
from sync.schedule import sync_schedules
from utils.fn import lprint_json
from utils.image import thumbnail


def get_provider(provider_type, root):
    if provider_type == 'fs':
        return FSProvider(root)
    elif provider_type == 'yd':
        return YDProvider(root, settings.yandex_disk_access_token)
    return None


def main(provider, fn, collection_name):
    if provider:
        print('SYNC: %s' % (collection_name.upper()))
        u, d = fn(provider, collection(collection_name), update=settings.do_update, delete=settings.do_update)

        print('DELETE %s: %s' % (collection_name.upper(), 'NO' if not settings.do_delete else str(len(d))))
        lprint_json(d)

        print('UPDATE %s: %s' % (collection_name.upper(), 'NO' if not settings.do_update else str(len(u))))
        lprint_json(u)

        print('')


if __name__ == '__main__':
    io = lambda root: get_provider(settings.sync_provider_type, root)

    main(io(settings.dir_documents), sync_documents, settings.collection_documents)
    main(io(settings.dir_awards), sync_documents, settings.collection_awards)
    main(io(settings.dir_schedules), sync_schedules, settings.collection_schedules)
    main(io(settings.dir_articles), sync_posts, settings.collection_articles)
    main(io(settings.dir_collective), sync_persons, settings.collection_collective)
    main(io(settings.dir_gallery), sync_albums, settings.collection_albums)
    main(io(settings.dir_pages), sync_pages, settings.collection_pages)
