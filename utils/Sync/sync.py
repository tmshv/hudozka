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
from sync.models.Settings import Settings


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


async def run_sync(sync: Sync):
    await sync.run()


async def run(run_interval=0):
    io = lambda root: get_provider(settings.provider_name, root)

    sync_documents = SyncDocument(
        provider=io(settings.dir_documents),
        sizes=settings.image_sizes,
    )

    sync_pages = Sync(
        provider=io(settings.provider_root),
        model=Page,
    )

    sync_persons = Sync(
        provider=io(settings.dir_collective),
        model=Person,
    )

    sync_articles = Sync(
        provider=io(settings.dir_articles),
        model=Article,
    )

    sync_schedules = Sync(
        provider=io(settings.dir_schedules),
        model=Schedule,
    )

    sync_albums = Sync(
        provider=io(settings.dir_albums),
        model=Album,
    )

    sync_settings = Sync(
        provider=io(settings.dir_settings),
        model=Settings,
    )

    while True:
        await asyncio.wait([
            run_sync(sync_documents),
            run_sync(sync_pages),
            run_sync(sync_persons),
            run_sync(sync_articles),
            run_sync(sync_schedules),
            run_sync(sync_albums),
            run_sync(sync_settings),
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
