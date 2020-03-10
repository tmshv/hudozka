import settings
from sync.core import Sync
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider

import asyncio
import logging

from sync.models.Page import Page, PageController


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


async def run_sync(sync: Sync, **kwargs):
    await sync.run(**kwargs)


async def run(run_interval=0):
    provider = get_provider(settings.provider_name, settings.provider_root)
    controller = PageController(provider)

    sync_pages = Sync(
        ctrl=controller,
        name='Page'
    )
    sync_pages.set_options(True, True, True)

    while True:
        await asyncio.wait([
            run_sync(sync_pages),
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
