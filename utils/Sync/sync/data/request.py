import aiohttp
from boto3 import session
from mimetypes import MimeTypes
import logging
import settings

logger = logging.getLogger(settings.name + '.S3')


async def s3_put(obj, path):
    """
    :param obj: uploads/file.pdf
    :param path: to/to/local/file.pdf
    :return:
    """
    logger.info('Put {}'.format(obj))

    s = session.Session()
    client = s.client('s3', **settings.auth_s3)

    mime = MimeTypes()
    mime_type, enc = mime.guess_type(path)

    # Upload a file to your Space
    client.upload_file(path, 'hudozka', obj, ExtraArgs={
        'ACL': 'public-read',
        'ContentType': mime_type,
    })


async def get(url):
    async with aiohttp.ClientSession as aio_session:
        res = aio_session.get(url)
        return await res.text()


async def post(url, data, params={}, headers={}):
    async with aiohttp.ClientSession() as aio_session:
        async with aio_session.post(url, data=data, params=params, headers=headers) as resp:
            return await resp.text()
