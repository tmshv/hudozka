import os
from lxml import etree

import lxml.html
import settings
from sync import create_post
from sync.core import Sync
from sync.models.product import create_product
from utils.fn import lmap, iterate_iter_over_fns, combine
from utils.hash import hash_file, hash_str
from utils.text.transform import url_encode_text


def create_url(a, i, s, e):
    return 'https://static.shlisselburg.org/art/images/product-{album}-{id}-{size}{ext}'.format(
        album=a,
        id=i,
        size=s,
        ext=e
    )


def url_creator(aid, pid):
    return lambda size, ext: create_url(aid, pid, size, ext.lower())


class SyncAlbum(Sync):
    @staticmethod
    def id_from_file(i):
        return url_encode_text(
            os.path.splitext(i)[0]
        )

    def __init__(self, collection, provider, image_creator, images_dir):
        super().__init__()
        self.collection = collection
        self.provider = provider
        self.image_creator = image_creator
        self.skip_image_processing = False
        self.images_dir = images_dir

    def create_id(self, document):
        if 'id' in document:
            return document

        y = str(document['date'].year)
        document['id'] = url_encode_text('-'.join([y, document['title']]))
        return document

    def create_hash(self, document):
        files = sorted(document['images'])
        hashes = lmap(
            self.provider.hash,
            lmap(
                lambda i: os.path.join(document['folder'], i),
                files
            )
        )

        document['hash'] = hash_str(
            combine([hash_str(document)] + hashes)
        )

        return document

    def create_image(self, file, url_fn):
        ss = settings.album_image_sizes
        od = self.images_dir
        sp = self.skip_image_processing

        return self.image_creator.create_image(file, ss, url_fn, od, skip_processing=sp)

    def create_album(self, doc):
        # url_base = 'https://static.shburg.org/art/image/product-{album}-{id}-{size}{ext}'

        image_id = SyncAlbum.id_from_file
        image_path = lambda i: os.path.join(doc['folder'], i)

        if 'title' not in doc or not doc['title']:
            return None

        create_album_id = lambda date, title: '{date}-{title}'.format(
            date=date.strftime('%Y'),
            title=url_encode_text(title)
        )

        doc['id'] = doc['id'] if 'id' in doc else create_album_id(doc['date'], doc['title'])

        if 'album' in doc:
            doc['album'] = self.create_products(doc, image_path)

        def process_post_image(src):
            path = image_path(src)

            if self.provider.exists(path):
                url = url_creator(
                    doc['id'],
                    image_id(src)
                )

                image = self.create_image(path, url)
                if image:
                    images.append(image)
                    return image['data']['big']['url']
            return None

        images = []
        post_html = create_post(doc['post'], process_post_image)

        if 'preview' in doc:
            preview = os.path.join(doc['folder'], doc['preview'])
            doc['preview'] = self.create_image(preview, url_creator(
                doc['id'],
                image_id(doc['preview'])
            ))

        doc['post'] = post_html
        doc['images'] = images
        return doc

    def create_products(self, doc, image_file_fn):
        image_id = SyncAlbum.id_from_file
        iter_album = iterate_iter_over_fns([
            lambda product: {
                **product,
                'image': self.create_image(
                    image_file_fn(product['file']),
                    url_creator(
                        doc['id'],
                        image_id(product['file'])
                    )
                )
            }
        ])

        return lmap(
            create_product,
            iter_album(doc['album'])
        )
