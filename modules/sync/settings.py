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

image_processing_enabled = value('image_processing')

image_ext = '.jpg'
image_sizes = [
    ('original', None, None),

    # ('big', 1500, 667),
    # ('medium', 400, 300),
]

date_formats = [
    '%Y',
    '%m.%Y',
    '%d.%m.%Y',
    '%d.%m.%Y %H:%M',
    '%d.%m.%Y %H:%M:%S'
]

collection_images = 'images'
collection_documents = 'documents'
collection_pages = 'pages'

hash_salt_pages = '6'
hash_salt_documents = '4'
hash_salt_images = '5'

provider_name = value('provider')['name']  # env('SYNC_PROVIDER', 'fs')
provider_root = value('provider')['root']  # env('SYNC_PROVIDER', 'fs')

f = abs_fn(provider_root)

dir_pages = './Pages'

document_url_template = 'https://static.shlisselburg.org/art/uploads/{file}'
document_url_preview_template = 'https://static.shlisselburg.org/art/images/{id}-{size}{ext}'

image_url_base = 'https://static.shlisselburg.org/art/images/'

yandex_disk_access_token = value('yandex_disk_access_token')  # env('YANDEX_DISK_ACCESS_TOKEN')

auth_s3 = {
    'region_name': 'ams3',
    'endpoint_url': 'https://dir.ams3.digitaloceanspaces.com',
    'aws_access_key_id': value('s3')['client_id'],
    'aws_secret_access_key': value('s3')['client_secret'],
}
