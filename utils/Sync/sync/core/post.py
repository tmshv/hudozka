import os
from tempfile import mkstemp

import lxml.html

from sync.core import Sync
from utils.fn import last_good, lmap, combine
from utils.hash import hash_str, hash_file
from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text, url_encode_file


class SyncPost(Sync):
    def __init__(self, collection, provider, document_type, image_url_base, dir_local_images, sizes):
        super().__init__()
        self.collection = collection
        self.provider = provider
        self.sizes = sizes
        self.type = document_type
        self.image_url_base = image_url_base
        self.dir_local_images = dir_local_images

    def create_id(self, document):
        document['id'] = document['id'] if 'id' in document else url_encode_text(document['title'])
        return document

    def create_hash(self, document):
        hash_images = lmap(
            self.provider.hash,
            lmap(
                lambda i: os.path.join(document['folder'], i),
                document['images']
            )
        )

        document['hash'] = hash_str(
            combine([hash_str(document)] + hash_images)
        )

        return document

    def create(self, document):
        if 'date' not in document or not document['date']:
            return None

        if 'title' not in document or not document['title']:
            return None

        if self.type:
            document['type'] = self.type

        post_html = lxml.html.fromstring(document['post'])
        images = []
        for img in post_html.cssselect('img'):
            src = img.get('src')
            img_path = os.path.abspath(
                os.path.join(document['folder'], src)
            )

            if os.path.exists(img_path):
                img_id = url_encode_text(os.path.splitext(src)[0])
                url_fn = lambda size, ext: self.image_url_base.format(
                    id=document['id'],
                    img=img_id,
                    size=size,
                    ext=ext.lower()
                )

                image = create_image(img_path, self.sizes, url_fn, self.dir_local_images)
                if image:
                    images.append(image)
                    img.set('src', image['data']['big']['url'])
                else:
                    print('fail: ', document['folder'], src)

        document['post'] = lxml.html.tostring(post_html).decode('utf-8')
        document['images'] = images
        return document

    def create_remove_query(self, query):
        if self.type:
            query = {
                **query,
                'type': self.type
            }
        return query
