from functools import reduce
from glob import glob
import os
import re
from pymongo import MongoClient
import img as img_util
from read_gallery_1 import GalleryReader

import settings

__author__ = 'Roman Timashev'

description_version_exp = re.compile('\[(\d+)\]\.md$')

dir_gallery = settings.root_dir_gallery
catalog_dir = os.path.expanduser(dir_gallery)
catalog_files = os.listdir(catalog_dir)
os.makedirs(settings.image_save_dir, exist_ok=True)


def get_description_version(filename):
    v = description_version_exp.search(filename)
    return v.group(1)


def get_description_reader(version):
    if version == '1':
        return GalleryReader

    return None


def process_product_image(product, save_dir):
    for k in product.image.keys():
        thumb = product.image[k]
        filename = os.path.basename(thumb['url'])
        outpath = os.path.join(save_dir, filename)
        img_util.image_magick_resize(
                product.image_original_path,
                outpath,
                (thumb['width'], thumb['height'])
        )


def get_db():
    client = MongoClient(settings.database_uri)
    return client.hudozka


def clear_db():
    db = get_db()
    db.products.drop()
    db.albums.drop()


def sync_product(product, type):
    db = get_db()
    author_name, author_age, image, product_title, original_path = product.to_tuple()

    return db['products'].insert(dict(
            author=author_name,
            authorAge=author_age,
            title=product_title,
            type=type,
            content=image
    ))


def sync_album(album):
    db = get_db()
    product_ids = list(map(
            lambda product: sync_product(product, album.type),
            album.products
    ))

    return db['albums'].insert(dict(
            title=album.title,
            uri=album.uri,
            date=album.date,
            description=album.comment,
            course=album.course,
            course_uri=album.course_uri,
            teacher=album.teacher,
            content=product_ids
    ))


def read_gallery_item(dir_name):
    """
    Read directory with .md and images and return an instance of Album.
    None if reads fails.

    :param dir_name:
    :return:
    """

    set_path = os.path.join(dir_gallery, dir_name)
    os.chdir(set_path)

    md = glob('*.md')
    if len(md) > 0:
        description_filename = md[0]
        description_path = os.path.join(set_path, description_filename)

        v = '1'
        DescriptionReader = get_description_reader(v)
        if DescriptionReader is not None:
            r = DescriptionReader(set_path, description_path)
            try:
                return r.read()

            except Exception as e:
                print('Error with reading description file %s' % (description_path))
                print(e)
    return None


if __name__ == '__main__':
    print('--> READING GALLERY CATALOGS')
    albums = list(map(read_gallery_item, catalog_files))

    print('--> GALLERY TO SYNC')
    albums = list(filter(lambda a: a is not None, albums))

    for a in albums:
        print(a)

    img = False
    save_dir = settings.image_save_dir
    print('--> PROCESSING IMAGES to %s (%s)' % (save_dir, img))
    if img:
        products = reduce(lambda p, a: p + a.products, albums, [])
        print('Products image to process %s' % len(products))
        for p in products:
            print('Process %s' % p.image_original_path)
            process_product_image(p, save_dir)

    sync = True
    print('--> SYNCING ALBUMS (%s)' % sync)
    if sync:
        print('--> DROP DB')
        clear_db()

        for a in albums:
            try:
                a_id = sync_album(a)
                print('SYNC DONE (%s: %s)' % a_id, a.title)

            except Exception as e:
                print('Cannot sync %s' % (a))
                print(e)

    exit()
