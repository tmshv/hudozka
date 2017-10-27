import os

import yaml
import argparse

__author__ = 'Roman Timashev'

name = 'HudozkaSync'

_parser = argparse.ArgumentParser(description='Hudozka Sync Daemon')
_parser.add_argument('--config', dest='config', default='config.yaml', help='path to config.yaml')
_args = _parser.parse_args()

config = yaml.load(open(_args.config, 'r'))


def value(key, default=None):
    return config[key] if key in config else default


def absolute(path, ensure=True):
    a = os.path.expanduser(path)
    if ensure:
        os.makedirs(a, exist_ok=True)
    return a


def abs_fn(root):
    return lambda path: os.path.join(root, path)


def env(param, default=None):
    if param in os.environ:
        return os.environ[param]
    return default


interval = value('interval', 0)

database_uri = value('database_uri')  # env('MONGO_URI')

skip_unchanged = value('skip_unchanged')

person_uri = {
    'Н.В.Андреева': 'nv-andreeva',
    'И.Н.Втюрина': 'in-vturina',
    'О.Д.Гоголева': 'od-gogoleva',
    'В.А.Саржин': 'va-sarzhin',
    'Р.К.Тимашев': 'rk-timashev',
    'А.С.Тимашева': 'as-timasheva',
}

upload_enabled = value('upload_enabled')
upload_url_image = 'https://static.shlisselburg.org/upload/art/images/{}'
upload_auth = (
    value('upload_auth')['login'],
    value('upload_auth')['password'],
)

image_processing_enabled = value('image_processing')

album_html_img_class = 'hudozka-product'

image_ext = '.jpg'
image_sizes = [
    ('original', None, None),

    ('large', 2500, 1000),
    ('large@2', 5000, 2000),

    ('big', 1500, 667),
    ('big@2', 3000, 1334),

    ('medium', 400, 300),
    ('medium@2', 800, 600),

    ('small', 250, 175),
    ('small@2', 500, 350),

    ('og', 968, 504),
    ('og@2', 1936, 1008),

    ('fb', 1200, 630),
    ('fb@2', 2400, 1260),
]

date_formats = [
    '%Y',
    '%m.%Y',
    '%d.%m.%Y',
    '%d.%m.%Y %H:%M',
    '%d.%m.%Y %H:%M:%S'
]

date_formats_direct = [
    '%Y',
    '%m.%Y',
    '%d.%m.%Y',
]

date_formats_reverse = [
    '%Y',
    '%Y.%m',
    '%Y.%m.%d'
]

origin = value('origin')

collection_settings = 'settings'
collection_images = 'images'
collection_documents = 'documents'
collection_schedules = 'schedules'
collection_articles = 'articles'
collection_collective = 'collective'
collection_albums = 'albums'
collection_pages = 'pages'

hash_salt_articles = '5'
hash_salt_pages = '2'
hash_salt_albums = '0'
hash_salt_documents = '1'
hash_salt_images = '0'
hash_salt_person = '2'

provider_name = value('provider')['name']  # env('SYNC_PROVIDER', 'fs')
provider_root = value('provider')['root']  # env('SYNC_PROVIDER', 'fs')

f = abs_fn(provider_root)

dir_settings = './Settings'
dir_documents = './Documents'
dir_schedules = './Schedules'
dir_articles = './Articles'
dir_persons = './Collective'
dir_albums = './Gallery'
dir_pages = './Pages'
dir_images = './Images'

document_url_template = 'https://static.shlisselburg.org/art/uploads/{file}'
document_url_upload_template = 'https://static.shlisselburg.org/upload/art/uploads/{file}'
document_url_preview_template = 'https://static.shlisselburg.org/art/images/{id}-{size}{ext}'

image_url_upload = 'https://static.shlisselburg.org/upload/art/images/'
image_url_base = 'https://static.shlisselburg.org/art/images/'

person_image_url_template = 'https://static.shlisselburg.org/art/images/person-{id}-{size}{ext}'

yandex_disk_access_token = value('yandex_disk_access_token')  # env('YANDEX_DISK_ACCESS_TOKEN')

update_enabled = value('update_enabled')
delete_enabled = value('delete_enabled')
