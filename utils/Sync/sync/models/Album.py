import logging

import os
from lxml import etree

import lxml.html

import kazimir
import settings
from db import collection
from sync import create_date_and_title_from_folder_name, images_from_html, create_post_from_image_list, create_date, \
    create_post
from sync.data import Provider, list_images
from sync.models import Model
from sync.models.Image import Image

from utils.fn import swap_ext, first, map_cases, constant, combine
from utils.hash import hash_str
from utils.io import read_yaml_md, parse_yaml_front_matter
from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Album')
store = collection(settings.collection_albums)


class Album(Model):
    @staticmethod
    async def find(query):
        return store.find(query)

    @staticmethod
    async def delete(query):
        return store.find_one_and_delete(query)

    @staticmethod
    async def scan(provider):
        scan_dir = settings.dir_albums
        documents = [i for i in provider.scan(scan_dir) if provider.is_dir(i)]
        documents = [Album.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
        date, title = create_date_and_title_from_folder_name(
            os.path.basename(path)
        )

        # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
        document = {
            'folder': path,
            'date': date,
            'title': title,
        }

        # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
        manifest_file = provider.type_filter(path, '.md')
        manifest_file = manifest_file[0] if len(manifest_file) else None
        manifest = get_manifest(provider, manifest_file) if manifest_file else {}
        manifest = manifest if manifest else {}

        file = manifest_file if manifest_file else path
        return Album(
            provider,
            file,
            params={
                **document,
                **manifest,
            },
        )

    def __init__(self, provider, file, params=None):
        self.__hash_salt = settings.hash_salt_albums

        self.version = '1'

        self.origin = settings.origin
        self.post = None
        self.images = []
        self.documents = []
        self.preview = None
        super().__init__(provider, store, file, params=params)

    def init(self):
        if self.has_param('content'):
            images, documents = kazimir.extract_files(self.get_param('content'))
        else:
            images = list_images(self.provider, self.file)
            images = [os.path.relpath(i, self.file) for i in images]
            documents = []
        self.params['images'] = images
        self.params['documents'] = documents

        self.__set_id()
        self.__set_hash()

    def validate(self):
        document = self.params
        if 'date' not in document or not document['date']:
            return None

        if 'title' not in document or not document['title']:
            return None

    async def build(self, **kwargs):
        sizes = kwargs['sizes']
        folder = self.get_param('folder')

        if self.has_param('content'):
            markdown_post = self.get_param('content')
        else:
            markdown_post = create_post_from_image_list(self.get_param('images'))

        post, images, documents = await create_post(self.provider, folder, markdown_post, sizes)
        self.post = post
        self.images = images
        self.documents = documents

        if self.has_param('preview'):
            preview = self.get_param('preview')
            preview = self._get_relpath(preview)
            preview = await Image.new(self.provider, preview, sizes=sizes)
            self.preview = preview

    def create_products(self, doc, image_file_fn):
        pass
        # image_id = id_from_file
        # iter_album = iterate_iter_over_fns([
        #     lambda product: {
        #         **product,
        #         'image': self.create_image(
        #             image_file_fn(product['file']),
        #             url_creator(
        #                 doc['id'],
        #                 image_id(product['file'])
        #             )
        #         )
        #     }
        # ])
        #
        # return lmap(
        #     create_product,
        #     iter_album(doc['album'])
        # )

    def bake(self):
        preview = None if not self.preview else self.preview.ref

        return {
            **self.params,
            'images': [x.ref for x in self.images],
            'documents': [x.ref for x in self.documents],
            'preview': preview,
            'post': self.post,
            'id': self.id,
            'hash': self.hash,
            'file': self.file,
            'origin': self.origin,
            'version': self.version,
        }

    def __set_id(self):
        if 'id' in self.params:
            self.id = self.params['id']
        else:
            year = str(self.params['date'].year)
            title = self.params['title']
            self.id = url_encode_text('%s-%s' % (year, title))

    def __set_hash(self):
        files = self.get_param('images')
        files = [self._get_relpath(i) for i in files]

        if not self.provider.is_dir(self.file):
            files.append(self.file)

        files = sorted(files)
        files = [self.provider.hash(i) for i in files]

        self.hash = hash_str(files)
        self.hash = hash_str(
            combine([self.__hash_salt] + [hash_str(self.params)] + files)
        )

    def __str__(self):
        return '<Album id={} file={}>'.format(self.id, self.file)


def get_manifest(provider, filepath):
    data = provider.read(filepath).read().decode('utf-8')
    manifest = parse_yaml_front_matter(data)

    if 'date' in manifest:
        manifest['date'] = create_date(str(manifest['date']), settings.date_formats_direct)

    if 'id' in manifest:
        manifest['id'] = str(manifest['id'])

    return manifest
