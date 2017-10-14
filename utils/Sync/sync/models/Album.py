import logging

import os

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
        documents = [i for i in provider.scan('.') if provider.is_dir(i)]
        documents = [Album.read(provider, i) for i in documents]
        return documents

    @staticmethod
    def read(provider, path):
        # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
        date, title = create_date_and_title_from_folder_name(
            os.path.basename(path)
        )

        images = list_images(provider, path)
        images = [os.path.relpath(i, path) for i in images]

        # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
        document = {
            'folder': path,
            'date': date,
            'title': title,
            'post': create_post_from_image_list(images),
            'images': images
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
        # self.__id_template: str = '{category}-{file}'
        # self.__url_template: str = settings.document_url_template
        # self.__url_preview_template: str = settings.document_url_preview_template

        self.sizes = settings.image_sizes
        self.version = '1'

        self.origin = settings.origin
        self.post = None
        self.images = None
        super().__init__(provider, store, file, params=params)

    def init(self):
        self.__set_id()
        self.__set_hash()

    def validate(self):
        document = self.params
        if 'date' not in document or not document['date']:
            return None

        if 'title' not in document or not document['title']:
            return None

    async def build(self, **kwargs):
        params = self.params
        image_id = id_from_file
        images = []

        create_album_id = lambda date, title: '{date}-{title}'.format(
            date=date.strftime('%Y'),
            title=url_encode_text(title)
        )

        # params['id'] = params['id'] if 'id' in params else create_album_id(params['date'], params['title'])

        # if 'album' in params:
        #     params['album'] = self.create_products(params, image_path)

        async def process_post_image(src):
            url = url_creator(
                self.id,
                id_from_file(src)
            )

            image_path = os.path.join(params['folder'], src)
            image = await Image.new(self.provider, image_path, self.sizes, url)
            if image:
                images.append(image)
                return image.get_size('big')['url']
            return None

        post_html = await create_post(params['post'], process_post_image)

        if self.has_param('preview'):
            preview = self.get_param('preview')
            preview = self._get_relpath(preview)
            preview = await Image.new(self.provider, preview, sizes=self.sizes)
        else:
            # preview = 'https://art.shlisselburg.org/entrance.jpg'
            preview = None

        self.post = post_html
        self.images = images
        self.preview = preview

        # sizes = kwargs['sizes']
        # post, images = await create_post(self.provider, self.id, self.params, sizes)
        # self.post = post
        # self.images = images
        #
        # post, images = await create_post(self.provider, self.id, self.params, sizes)
        # self.post = kazimir.html_from_tree(post)
        # self.images = images

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
            'images': [i.ref for i in self.images],
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
            combine([hash_str(self.params)] + files)
        )

    def __str__(self):
        return '<Album hash={} id={} file={}>'.format(self.hash, self.id, self.file)


def get_manifest(provider, filepath):
    data = provider.read(filepath).read().decode('utf-8')
    y, m = read_yaml_md(data)

    data = {**y} if y else {}
    _ = lambda key, d=None: data[key] if key in data else d

    date = create_date(str(_('date')), settings.date_formats_direct)
    if date:
        data['date'] = date

    album_id = _('id')
    if album_id:
        data['id'] = str(album_id)

    post = {'post': m} if m else {}
    return {**data, **post}


def create_url(a, i, s, e):
    return 'https://static.shlisselburg.org/art/images/product-{album}-{id}-{size}{ext}'.format(
        album=a,
        id=i,
        size=s,
        ext=e
    )


def url_creator(aid, pid):
    return lambda file, size, ext: create_url(aid, pid, size, ext.lower())


def id_from_file(i):
    return url_encode_text(
        os.path.splitext(i)[0]
    )
