import logging
import os
import tempfile
import asyncio

from typing import Optional, List

import settings
from db import collection
from sync.data import request, list_images
from sync.models import Model
from utils.hash import md5, hash_str
from utils.image import image_magick_resize
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Image')

store = collection(settings.collection_images)


def get_upload_url(url):
    return os.path.join(settings.image_url_upload, os.path.basename(url))


def default_url_factory(file, size, ext):
    url = settings.image_url_base + '{}-{}{}'
    return url.format(md5(file), size, ext.lower())


class Image(Model):
    @staticmethod
    async def find_one(query):
        document = store.find_one(query)
        return document

    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

    @staticmethod
    async def new(provider, file, sizes, url_factory=None):
        url_factory = url_factory if url_factory else default_url_factory

        img = Image(provider, file, data=None, url_factory=url_factory)
        changed = await img.is_changed()
        if changed:
            await img.build(sizes=sizes)
            await img.upload()
            await img.save()
        else:
            doc = await Image.find_one({'file': file})
            img = Image(provider, file, doc['data'], url_factory)
            img.ref = doc['_id']

        return img

    @staticmethod
    async def scan(provider):
        scan_path = settings.dir_images
        documents = list_images(provider, scan_path)

        return [Image.read_path(provider, i) for i in documents]

    @staticmethod
    def read_path(provider, path):
        return Image(
            provider,
            path,
            data=None,
            url_factory=default_url_factory
        )

    def __init__(self, provider, file, data, url_factory):
        self.__hash_salt = settings.hash_salt_images

        self.origin = None

        self.data = data
        self.url_factory = url_factory

        super().__init__(provider, store, file)

    def init(self):
        self.id = self.__get_id()
        self.hash = self.__get_hash()

        self.origin = f"{settings.origin}:{os.path.dirname(self.file)}"

    async def is_changed(self):
        i = await Image.find_one({'file': self.file})
        return self._is_changed_hash(i)

    async def build(self, sizes):
        logger.info(f'Building Image {self._get_abs(self.file)}')

        img_in = self._get_image_file()
        img_out = tempfile.mkdtemp()

        images = await create_image(img_in, sizes, self.url_factory, img_out)
        if not images:
            raise Exception('Failed to create Image {}'.format(img_in))
        data = {}
        for i in images:
            if i:
                size_name = i['size']
                data[size_name] = {
                    **i,
                }
        self.data = data

    async def upload(self):
        if self.data:
            async def fn(i):
                url = get_upload_url(i['url'])
                file = i['file']

                logger.info('Uploading to {}'.format(url))
                await request.upload(url, file)

            await asyncio.wait([fn(i) for i in self.data.values()])

    async def save(self):
        c = sync_image(self.bake())
        self.ref = c['_id']

    def bake(self):
        return {
            'id': self.id,
            'file': self.file,
            'origin': self.origin,
            'hash': self.hash,
            'data': self.data,
        }

    def get_size(self, size):
        if size in self.data:
            return self.data[size]
        return None

    def _get_image_file(self):
        return self._get_abs(self.file)

    def __filename(self):
        return os.path.basename(self.file)

    def __get_id(self):
        return md5(self.file)

    def __get_hash(self):
        file_hash = self.provider.hash(self.file)
        return hash_str(self.__hash_salt + file_hash)

    def __str__(self):
        return '<Image hash={} file={}>'.format(self.hash, self.file)


def sync_image(record):
    from db import db

    q = {'hash': record['hash']}
    try:
        db().images.update_one(q, {'$set': record}, upsert=True)
        i = db().images.find_one({'hash': record['hash']})
        return i
    except ValueError:
        pass

    return None


async def create_image(file: str, sizes: [()], url_fn, output_dir: str) -> Optional[List[dict]]:
    """

    :param file: Image path to process
    :param sizes: list of sizes to generate image (<size_name>, <width>, <height>)
    :param url_fn: function (size_name, ext) for creating image url
    :param output_dir: path to local folder for thumbs storing
    :return:
    """
    if not os.path.exists(file):
        return None

    _, ext = os.path.splitext(file)
    images = []

    async def fn(size):
        size_name, width, height = size

        image_url = url_fn(file, size_name, ext)
        image_filename = os.path.basename(image_url)
        local_image_path = os.path.join(output_dir, image_filename)

        # if settings.image_processing_enabled:
        image = await process_image(file, local_image_path, size)
        if not image:
            logger.warning('Failed to process image {}'.format(file))
            return None
        width, height = image.size

        images.append({
            'file': local_image_path,
            'url': image_url,
            'size': size_name,
            'width': width,
            'height': height
        })

    await asyncio.wait([fn(s) for s in sizes])

    return images


async def process_image(input_file, output_file, size):
    size_name, width, height = size

    if size_name == 'original':
        return await optimize(input_file, output_file, quality=90)
    else:
        image = await read_image(input_file)
        if not image:
            return None
        image_width, image_height = image.size
        if image_height > image_width:
            width, height = height, width
        return await thumbnail(input_file, output_file, (width, height), quality=90)


async def read_image(src):
    import aiofiles
    from PIL import Image
    import io

    async with aiofiles.open(src, mode='rb') as f:
        image_data = await f.read()
        image = Image.open(io.BytesIO(image_data))
        return image


async def thumbnail(src, dest, size, quality):
    await image_magick_resize(src, dest, size, quality)
    return await read_image(dest)


async def optimize(src, dest, quality):
    image = await read_image(src)
    image.save(dest, quality=quality)
    return image
