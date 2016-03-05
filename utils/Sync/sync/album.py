import os
from glob import glob

import lxml.html
from lxml import etree

import settings
from db import db
from models.product import create_product
from sync import create_date_and_title_from_folder_name, create_post_from_image_list, create_date, Sync, list_images, \
    untouched, synced_images_ids
from utils.fn import lmap, dir_globber, lprint_json, iterate_iter_over_fns, first, map_cases, combine, lmapfn, \
    key_mapper, lprint
from utils.hash import hash_file, hash_str
from utils.image import create_image
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


class ImageCreator:
    def __init__(self, cache):
        super().__init__()
        self.cache = cache if cache else set()

    def create_image(self, file, sizes, url_fn, output_dir, skip_processing=False):
        hash = hash_file(file)
        cached = self.cached(hash)
        return create_image(file, sizes, url_fn, output_dir, skip_processing=skip_processing) if not cached else cached

    def cached(self, hash):
        return self.cache[hash] if hash in self.cache else None


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


def create_url(a, i, s, e):
    return 'https://static.shburg.org/art/images/product-{album}-{id}-{size}{ext}'.format(
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

    def __init__(self, image_creator, images_dir):
        super().__init__()
        self.collection = db().albums
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
        hash_images = lmap(
            hash_file,
            lmap(
                lambda i: os.path.join(document['folder'], i),
                document['images']
            )
        )
        document['hash'] = hash_str(
            combine([hash_str(document)] + hash_images)
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

            if os.path.exists(path):
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
            },
            # lambda product: {
            #     **product,
            #     'awards': lmap(
            #         lambda award: {
            #             **award,
            #             'file': os.path.join(doc['folder'], award['file']),
            #             'assigned': interpolate(award['assigned'], product, interpolate_swift),
            #             # 'awardFor': product
            #         },
            #         product['awards']
            #     )
            # }
        ])

        return lmap(
            create_product,
            iter_album(doc['album'])
        )


def get_manifest(filepath):
    y, m = read_yaml_md(filepath)

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


def main(dir_documents, sync):
    os.chdir(dir_documents)

    # GET ALBUMS FOLDERS
    documents = lmap(
        lambda i: i.path,
        filter(
            lambda i: i.is_dir(),
            os.scandir('.')
        )
    )

    # documents = [documents[3]]
    # documents = documents[:15]

    # PARSE FOLDER NAME -> GET OPTIONAL DATE/TITLE
    documents = lmap(
        lambda i: (i,) + create_date_and_title_from_folder_name(
            os.path.basename(i)
        ),
        documents
    )

    # CREATE BASIC_MANIFEST BASED ON FOLDER NAME AND IMAGE CONTENT
    glob_in = dir_globber(['*.jpg', '*.JPG', '*.png', '*.PNG'])
    documents = lmap(
        lambda i: {
            'folder': i[0],
            'date': i[1],
            'title': i[2],
            'post': create_post_from_image_list(lmap(
                lambda path: os.path.relpath(path, i[0]),
                glob_in(i[0])
            ))
        },
        documents
    )

    # TRY TO FILL UP BASIC_MANIFEST WITH MD_MANIFEST
    md_glob = lambda i: first(glob(i + '/*.md'))
    documents = lmap(
        lambda album: {
            **album,
            **map_cases(
                album,
                [(
                    lambda album: md_glob(album['folder']),
                    lambda album: get_manifest(md_glob(album['folder'])),
                )],
                lambda i: {}
            )
        },
        documents
    )
    documents = lmap(
        lambda i: {
            **i,
            'images': lmap(
                lambda path: os.path.relpath(path, i['folder']),
                list_images(i['folder'])
            )
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE HASH OF DOCUMENT FILE
    documents = lmap(sync.create_hash, documents)

    # CREATE SCOPE OF CURRENT SESSION
    scope_documents_ids = lmapfn(documents)(
        lambda i: i['id']
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # MAP EVENT MANIFEST -> EVENT_OBJECT
    documents = lmap(
        alb.create_album,
        documents
    )

    # FILTER INCORRECT EVENTS
    documents = list(filter(None, documents))

    # REPLACE IMAGES OBJECTS WITH IT _ID IN MONGODB
    documents = lmap(
        key_mapper('images', synced_images_ids),
        documents
    )

    # SYNC OBJECT WITH DB
    documents = lmap(
        sync.update,
        documents
    )

    documents_to_remove = sync.query({'id': {'$nin': scope_documents_ids}})
    documents_to_remove = lmap(
        sync.delete,
        map(
            lambda i: {'_id': i['_id']},
            documents_to_remove
        )
    )

    # SCOPE
    print('SCOPE:')
    lprint(scope_documents_ids)

    # DELETE
    print('DELETE DOCUMENTS:')
    lprint_json(lmap(
        lambda i: i['id'],
        documents_to_remove
    ))

    # DELETE
    print('UPDATE DOCUMENTS:')
    lprint_json(lmap(
        lambda i: i['id'],
        documents
    ))
    # lprint_json(documents)
    print('[SYNC DOCUMENTS DONE]')


if __name__ == '__main__':
    image_creator = ImageCreator(cache=None)
    alb = SyncAlbum(image_creator=image_creator, images_dir=settings.image_output)
    alb.skip_image_processing = True

    albums_dir = '/Users/tmshv/Dropbox/Dev/Hud school/Gallery'
    main(dir_documents=albums_dir, sync=alb)
