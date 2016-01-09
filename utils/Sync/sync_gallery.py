from glob import glob
import os
import re
from pymongo import MongoClient
import img
from read_gallery_1 import GalleryReader

import settings
import validation

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


def process_image(name, filename, sizes):
    ext = settings.image_ext

    thumbs = {}

    for size, width, height in sizes:
        source_image = img.read_image(filename)
        sw, sh = source_image.size
        if sw < sh:
            width, height = height, width

        out_image_filename = '{name}-{size}{ext}'.format(name=name, size=size, ext=ext)
        out_image_local_path = os.path.join(settings.image_save_dir, out_image_filename)
        out_image_url = os.path.join(settings.image_base_url, out_image_filename)

        if width and height:
            tw = width
            th = height
        else:
            tw = sw
            th = sh

        thumbs[size] = {
            'url': out_image_url,
            'size': size,
            'width': sw,
            'height': sh
        }

        # print('generate %s for %s' % (size, filename), out_image_url)

        if settings.image_processing:
            if width and height:
                img.minify(source_image, out_image_local_path, (width, height))
            else:
                img.optimize(source_image, out_image_local_path)

    return thumbs


def process_product(album, product):
    tr = {ord(a):ord(b) for a, b in zip(*settings.translit_table)}

    author_name, author_age, filename, product_title = product
    author_name_encoded = re.sub(r'[\s()]', '', author_name).lower().translate(tr)
    image_id = '%s-%s-%s-%s' % (
        album.date.year,
        re.sub(r'[/]', '', album.uri),
        author_name_encoded,
        os.path.splitext(filename)[0]
    )

    image = process_image(image_id, filename, settings.image_sizes)
    return (author_name, author_age, image, product_title)


def get_db():
    client = MongoClient(settings.database_uri)
    return client.hudozka


def clear_db():
    db = get_db()
    db.products.drop()
    db.albums.drop()


def sync_product(product, type):
    db = get_db()
    author_name, author_age, image, product_title = product

    product_record = db['products'].insert({
        'author': author_name,
        'authorAge': author_age,
        'title': product_title,
        'type': type,
        'content': image
    })

    print('inserted', product_record)

    return product_record

def sync_album(album):
    print('syncing %s' % album.title)
    db = get_db()

    product_ids = list(map(
        lambda product: sync_product(product, album.type),
        album.products
    ))

    album_title = album.title
    album_uri = album.uri
    album_teacher = album.teacher
    album_date = album.date
    album_comment = album.comment
    album_course = album.course
    album_course_uri = album.course_uri

    db['albums'].insert({
        'title': album_title,
        'uri': album_uri,
        'date': album_date,
        'description': album_comment,
        'course': album_course,
        'course_uri': album_course_uri,
        'teacher': album_teacher,
        'content': product_ids
    })


def read_gallery_item(dir_name, sync=True):
    """
    Read directory with .md and images and return an instance of Album.
    None if reads fails.

    :param dir_name:
    :param sync:
    :return:
    """

    set_path = os.path.join(dir_gallery, i)
    os.chdir(set_path)

    md = glob('*.md')
    if len(md) > 0:
        description_filename = md[0]
        description_path = os.path.join(set_path, description_filename)

        #if validation.check_description_filename(description_filename):
        if True:
            #v = get_description_version(description_filename)
            v = '1'
            DescriptionReader = get_description_reader(v)
            if DescriptionReader is not None:
                r = DescriptionReader(description_path)
                album = None
                try:
                    album = r.read()

                except Exception as e:
                    print('Error with reading description file %s' % (description_path))
                    print(e)
                    return

                try:
                    album.products = list(map(
                        lambda p : process_product(album, p),
                        album.products
                    ))
                except Exception as e:
                    print('Error with image processing %s' % (description_path))
                    print(e)

                if sync:
                    try:
                        sync_album(album)
                    except Exception as e:
                        print('Cannot sync %s' % (description_path))
                        print(e)

            else:
                print('No reader for description file %s' % (description_path))

        else:
            new_name = validation.suggest_description_filename(description_filename)
            os.rename(description_filename, new_name)
            read_gallery_item(dir_name)


if __name__ == '__main__':
    # clear_db()
    for i in catalog_files:
        read_gallery_item(i, sync=False)
        print()

    exit()
