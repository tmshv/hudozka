import settings
from sync.core import Sync
from sync.core.SyncDocument import SyncDocument
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider

import asyncio
import logging

from sync.models.Album import Album
from sync.models.Article import Article
from sync.models.Page import Page
from sync.models.Person import Person
from sync.models.Schedule import Schedule


def init_logger(name: str, file: str):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # create file handler which logs even debug messages
    fh = logging.FileHandler(file)
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

    documents = SyncDocument(
        provider=io(settings.dir_documents),
        sizes=settings.image_sizes,
    )

    pages = Sync(
        provider=io(settings.dir_pages),
        model=Page,
    )

    persons = Sync(
        provider=io(settings.dir_collective),
        model=Person,
    )

    articles = Sync(
        provider=io(settings.dir_articles),
        model=Article,
    )

    schedules = Sync(
        provider=io(settings.dir_schedules),
        model=Schedule,
    )

    albums = Sync(
        provider=io(settings.dir_albums),
        model=Album,
    )

    while True:
        await asyncio.wait([
            main(documents),
            main(pages),
            main(persons),
            main(articles),
            main(schedules),
            main(albums),
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
    init_logger(settings.name, 'hudozka.log')

    interval = settings.interval

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(interval))
    loop.close()

