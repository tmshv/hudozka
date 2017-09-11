import os

import logging

from lxml import etree
import lxml.html

import settings
from db import collection
from sync.data import request
from sync.models import Model

from sync import create_date, images_from_html, title_from_html
from sync.models.Image import Image
from utils.hash import hash_str
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Page')


def find(store, item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class Page(Model):
    @staticmethod
    async def scan(provider):
        documents = [i for i in provider.scan('.') if provider.is_dir(i)]
        documents = [provider.type_filter(i, '.md') for i in documents]
        documents = [i[0] for i in documents if len(i)]
        documents = [Page.read_path(provider, i) for i in documents]
        documents = [i for i in documents if i]

        return documents

    @staticmethod
    def read_path(provider, path):
        params = {
            'file': os.path.basename(path),
            'folder': os.path.dirname(path),
            'title': os.path.basename(path),
        }

        manifest = get_manifest(provider, path)
        params = {
            **params,
            **manifest,
        }

        if 'url' not in params:
            logger.warning('URL not specified for Page {}'.format(path))
            return None

        return Page(
            provider,
            path,
            params=params,
        )

    def __init__(self, provider, file, params=None):
        store = collection(settings.collection_pages)

        self.__hash_keys = ['id', 'url']

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = settings.document_url_template
        self.__url_preview_template: str = settings.document_url_preview_template

        self.params = params if params else {}

        super().__init__(provider, store, file)

    def init(self):
        self.__set_id()
        self.__set_url()
        self.__set_hash()

    async def is_changed(self):
        i = find(self.store, self.id)
        if not i:
            return True

        if 'hash' not in i:
            return True

        return not (self.hash == i['hash'])

    async def save(self):
        document = self.bake()

        query = {'id': document['id']}
        try:
            self.store.update_one(query, {'$set': document}, upsert=True)
            return self
        except ValueError:
            pass
        return None

    async def setup_images(self, sizes, url_factory):
        folder = self.params['folder']
        images = []
        for i in self.params['images']:
            img_file = os.path.join(folder, i)

            img = await Image.new(self.provider, img_file, sizes, url_factory)
            if img:
                images.append(img)
        self.images = images

    def bake(self):
        images = [image.id for image in self.images]

        data = create_post(self.params['data'], lambda src: self.__image_url_by_src(src))

        return {
            **self.params,
            'id': self.id,
            'hash': self.hash,
            'url': self.url,
            'file': self.file,
            'data': data,
            'images': images,
        }

    def __image_url_by_src(self, src):
        for img in self.images:
            if img.file.endswith(src):
                s = img.get_size('big')
                if s:
                    return s['url']
                else:
                    return None

        return None

    def __filename(self):
        return os.path.basename(self.file)

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            self.id = url_encode_text(self.params['url'])

    def __set_url(self):
        self.url = self.params['url']

    def __set_hash(self):
        images = [os.path.join(self.params['folder'], i) for i in self.params['images']]
        files = sorted([self.file] + images)
        hashes = [self.provider.hash(i) for i in files]

        self.hash = hash_str(''.join(hashes))

    def __str__(self):
        return '<Page hash={} file={} id={}>'.format(self.hash, self.file, self.id)


def create_post(md, image_path_fn):
    html = lxml.html.fromstring(md)

    for img in html.cssselect('img'):
        src = img.get('src')
        path = image_path_fn(src)

        if path:
            img.set('src', path)
            img.set('class', settings.album_html_img_class)
            img.set('data-file', src)
    return etree.tounicode(html)


def get_manifest(provider, path):
    dirname = os.path.dirname(path)
    data = provider.read(path).read().decode('utf-8')
    manifest, body = read_yaml_md(data)
    manifest = manifest if manifest else {}

    if 'date' in manifest:
        manifest['date'] = create_date(manifest['date'], settings.date_formats)

    if 'until' in manifest:
        manifest['until'] = create_date(manifest['until'], settings.date_formats)

    if 'id' in manifest:
        manifest['id'] = str(manifest['id'])

    if 'content' in manifest:
        body = provider.read(os.path.join(dirname, manifest['content'])).read().decode('utf-8')
        del manifest['content']

    return {
        **manifest,
        'data': body,
        'title': title_from_html(body),
        'images': images_from_html(body)
    }
