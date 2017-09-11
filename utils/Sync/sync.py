import settings
from db import db, collection
from sync.album import sync_albums
from sync.core import Sync
from sync.core.SyncDocument import SyncDocument
from sync.data import Provider
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider
from sync.document import sync_documents
from sync.page import sync_pages
from sync.person import sync_persons
from sync.post import sync_posts
from sync.schedule import sync_schedules
from utils.fn import lprint_json
from utils.image import thumbnail

import asyncio
import datetime
import logging

# create logger with 'spam_application'
logger = logging.getLogger(settings.name)
logger.setLevel(logging.DEBUG)

# create file handler which logs even debug messages
fh = logging.FileHandler('hudozka.log')
fh.setLevel(logging.DEBUG)

# create console handler with a higher log level
ch = logging.StreamHandler()
# ch.setLevel(logging.ERROR)
ch.setLevel(logging.DEBUG)

# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)

# add the handlers to the logger
logger.addHandler(fh)
logger.addHandler(ch)


async def main(sync: Sync):
    await sync.run()


async def run(run_interval=0):
    io = lambda root: get_provider(settings.provider_name, root)
    c = collection

    documents = SyncDocument(
        provider=io(settings.dir_documents),
        collection=c(settings.collection_documents),
        sizes=settings.image_sizes,
    )

    while True:
        # main(io(settings.dir_documents), sync_documents, settings.collection_documents)
        # main(io(settings.dir_awards), sync_documents, settings.collection_awards)
        # main(io(settings.dir_schedules), sync_schedules, settings.collection_schedules)
        # main(io(settings.dir_articles), sync_posts, settings.collection_articles)
        # main(io(settings.dir_collective), sync_persons, settings.collection_collective)
        # main(io(settings.dir_gallery), sync_albums, settings.collection_albums)
        # main(io(settings.dir_pages), sync_pages, settings.collection_pages)

        await asyncio.wait([
            main(documents),
        ])

        if run_interval == 0:
            break
        else:
            await asyncio.sleep(run_interval)


def get_provider(provider_type, root):
    if provider_type == 'fs':
        return FSProvider(root)
    elif provider_type == 'yd':
        return YDProvider(root, settings.yandex_disk_access_token)
    return None


if __name__ == '__main__':
    interval = settings.interval

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(interval))
    loop.close()

    # Да, 968×504 пискеля это меньше минимально рекомендованных Фейсбуком 1200×630.
    # Зато при таком размере и ратио картинку нигде не кропят, и выглядит она отлично.
