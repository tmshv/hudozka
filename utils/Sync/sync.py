import settings
from db import collection
from sync.core import Sync
from sync.core.SyncArticle import SyncArticle
from sync.core.SyncDocument import SyncDocument
from sync.core.SyncPage import SyncPage
from sync.core.SyncPerson import SyncPerson
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider

import asyncio
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

    pages = SyncPage(
        provider=io(settings.dir_pages),
        collection=c(settings.collection_pages),
    )

    persons = SyncPerson(
        provider=io(settings.dir_collective),
        collection=c(settings.collection_collective),
    )

    articles = SyncArticle(
        provider=io(settings.dir_articles),
        collection=c(settings.collection_articles),
    )

    while True:
        # main(io(settings.dir_schedules), sync_schedules, settings.collection_schedules)
        # main(io(settings.dir_gallery), sync_albums, settings.collection_albums)

        await asyncio.wait([
            main(documents),
            main(pages),
            main(persons),
            main(articles),
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
