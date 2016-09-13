import os

__author__ = 'Roman Timashev'


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


root_dir_gallery = './Gallery'
root_dir_schedule = './Schedules'

default_description_version = 1

database_uri = env('MONGO_URI')

teachers_names = {
    'Н.В.Андреева': 'nv-andreeva',
    'И.Н.Втюрина': 'in-vturina',
    'О.Д.Гоголева': 'od-gogoleva',
    'В.А.Саржин': 'va-sarzhin',
    'Р.К.Тимашев': 'rk-timashev',
    'А.С.Тимашева': 'as-timasheva',
}

image_processing = True

album_html_img_class = 'hudozka-product'

image_ext = '.jpg'
image_sizes = [
    ('original', None, None),
    ('big', 1500, 667),
    ('medium', 400, 300),
    ('small', 250, 175),
    ('little', 100, 100),
    ('preview', 50, 50),
]

awards_image_sizes = [
    ('medium', 640, 480),
    ('small', 300, 200),
    ('preview', 50, 50),
]

event_image_sizes = [
    ('big', 1200, 800)
]

teacher_image_url_base = 'https://static.shburg.org/art/images/teacher-{id}-{size}{ext}'
teacher_image_output = '/Users/tmshv/Desktop/Hudozka Static/images'
teacher_image_sizes = [
    ('big', 1200, 800),
    ('medium', 640, 480),
    ('preview', 50, 50),
]

album_image_sizes = [
    ('big', 1200, 800),
    ('medium', 640, 480),
    ('small', 250, 175)
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

collection_documents = 'documents'
collection_schedules = 'schedules'

sync_provider_type = env('SYNC_PROVIDER', 'fs')

_providers_roots = {
    'fs': abs_fn('/Users/tmshv/Yandex.Disk'),
    'yd': abs_fn('/'),
}
f = _providers_roots[sync_provider_type]

dir_documents = f('Hudozka/Site/Documents')
dir_schedules = f('Hudozka/Site/Schedules')
dir_events = f('Hudozka/Site/Events')
dir_news = f('Hudozka/Site/News')

dir_static = env('SYNC_STATIC', '~/Hudozka Static')
dir_static_uploads = absolute(dir_static + '/uploads')
dir_static_images = absolute(dir_static + '/images')

url_base_preview = 'https://static.shburg.org/art/images/{id}-{size}{ext}'
url_base_document = 'https://static.shburg.org/art/uploads/{file}'

image_base_url = 'https://static.shburg.org/art/images/'
image_name_format = '{type}-{id}-{img}-{size}{ext}'

yandex_disk_access_token = env('YANDEX_DISK_ACCESS_TOKEN')

do_update = env('SYNC_ENV', 'production') == 'production'
do_delete = env('SYNC_ENV', 'production') == 'production'
