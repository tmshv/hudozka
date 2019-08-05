import settings
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider

import asyncio


async def run_check(run_interval=0):
    run_interval = 1

    from yandexdisk import YDClient
    client = YDClient(settings.yandex_disk_access_token)

    async def need_to_update():
        res = client.last_uploaded()
        items = res['items']
        paths = [i['path'] for i in items]

        for i in paths:
            if i.startswith('disk:/Hudozka/Site'):
                return True

        return False

    while True:
        status = await need_to_update()
        if status:
            print('DO SYNC')
            # await run(0)

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
    loop.run_until_complete(run_check(interval))
    loop.close()
