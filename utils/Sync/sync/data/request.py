import aiohttp
import requests

import settings


async def upload(url, path):
    """
    :param url:
    :param path:
    :return:
    """

    if not settings.upload_enabled:
        return url

    # urlf = 'https://static.shlisselburg.org/upload/art{}'

    files = {'file': open(path, 'rb')}
    r = requests.put(
        url=url,
        files=files,
        auth=settings.upload_auth
    )
    if r.status_code == 200:
        return url
    else:
        return None


async def get(url):
    async with aiohttp.ClientSession as session:
        res = session.get(url)
        return await res.text()


async def put(url, data):
    async with aiohttp.ClientSession as session:
        res = session.put(url, data=data)
        return await res.text()
