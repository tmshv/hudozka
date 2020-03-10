import os
import logging
from lxml import etree
import lxml.html
import kazimir
import settings
from db import collection
from sync.data import request
from sync.models import Model
from sync import create_date, title_from_html, create_post
from sync.models.Image import Image
from utils.hash import hash_str
from utils.io import parse_yaml_front_matter
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Page')
store = collection(settings.collection_pages)


def find(store, item_id: str):
    q = {'id': item_id}
    try:
        return store.find_one(q)
    except ValueError:
        pass
    return None


class PageController:
    def __init__(self, provider):
        self.provider = provider

    async def find(self, query):
        return store.find(query)

    async def delete_item(self, query):
        return store.find_one_and_delete(query)

    async def get_items(self):
        scan_path = settings.dir_pages
        items = []
        for path in self.provider.scan(scan_path):
            if not self.provider.is_dir(path):
                continue
            item = await self.create_item(path)
            if not item:
                continue
            items.append(item)
        return items

    async def create_item(self, path: str):
        """
        :param path: path to page manifest file. For example: /Pages/<Some_Page>/<Some_Page>.md
        :return:
        """
        dir_name = os.path.basename(path)
        manifest_path = os.path.join(path, f'{dir_name}.md')

        if not self.provider.exists(manifest_path):
            logger.warning(f'Manifest not found on path {manifest_path}')
            return None

        params = {
            'file': os.path.basename(manifest_path),
            'folder': os.path.dirname(manifest_path),
        }

        manifest = await self.get_manifest(manifest_path)
        params = {
            **params,
            **manifest,
        }

        if 'url' not in params:
            logger.warning(f'URL not specified for Page {manifest_path}')
            return None

        return Page(
            self.provider,
            manifest_path,
            params=params,
        )

    async def get_manifest(self, path: str):
        data = self.provider.read(path).read().decode('utf-8')
        manifest = parse_yaml_front_matter(data)

        if 'date' in manifest:
            manifest['date'] = create_date(
                manifest['date'], settings.date_formats)

        if 'until' in manifest:
            manifest['until'] = create_date(
                manifest['until'], settings.date_formats)

        if 'id' in manifest:
            manifest['id'] = str(manifest['id'])

        return manifest


class Page(Model):
    def __init__(self, provider, file, params=None):
        self.__hash_salt = settings.hash_salt_pages
        self.__hash_keys = ['id', 'url']
        self.images = []
        self.documents = []
        self.title = None
        self.data = None
        self.preview = None
        self.tokens = None

        self.__id_template: str = '{category}-{file}'
        self.__url_template: str = settings.document_url_template
        self.__url_preview_template: str = settings.document_url_preview_template

        super().__init__(provider, store, file, params=params)

    def init(self):
        images, documents = kazimir.extract_files(self.get_param('content'))
        self.params['images'] = images
        self.params['documents'] = documents

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

    async def build(self, **kwargs):
        sizes = kwargs['sizes']

        markdown_post = self.get_param('content')
        post, images, documents, tokens = await create_post(self.provider, self.get_param('folder'), markdown_post, sizes)
        self.title = title_from_html(post)
        self.data = post
        self.images = images
        self.documents = documents
        self.tokens = tokens

        if self.has_param('preview'):
            preview = self.get_param('preview')
            preview = self._get_relpath(preview)
            self.preview = await Image.new(self.provider, preview, sizes)

    def bake(self):
        images = [x.ref for x in self.images]
        documents = [x.ref for x in self.documents]

        return {
            **self.params,
            'id': self.id,
            'hash': self.hash,
            'url': self.url,
            'file': self.file,
            'data': self.data,
            'images': images,
            'documents': documents,
            'title': self.title,
            'tokens': self.tokens,
            'preview': self.preview.ref if self.preview else None,
        }

    def __filename(self):
        return os.path.basename(self.file)

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.get_param('id')
        else:
            self.id = url_encode_text(self.get_param('url'))

    def __set_url(self):
        self.url = self.params['url']

    def __set_hash(self):
        files = []
        files += self.get_param('images')
        files += self.get_param('documents')
        folder = self.get_param('folder')
        files = [os.path.join(folder, x) for x in files]
        files = sorted([self.file] + files)

        hashes = [self.provider.hash(x) for x in files]
        self.hash = hash_str(self.__hash_salt + ''.join(hashes))

    def __str__(self):
        return '<Page file={} id={}>'.format(self.file, self.id)
