import os

__author__ = 'Roman Timashev'


def abs_fn(root):
    return lambda path: os.path.join(root, path)


root_dir_gallery = './Gallery'
root_dir_schedule = './Schedules'

default_description_version = 1

database_uri = os.environ['MONGO_URI']

CYR_LOWER = 'йцукенгшщзхъфывапролджэячсмитьбю'
CYR_UPPER = 'ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'
EN_LOWER = 'qwertyuiopasdfghjklzxcvbnm'
EN_UPPER = 'QWERTYUIOPASDFGHJKLZXCVBNM'
DIGITS = '0123456789'
description_available_chars = CYR_LOWER + CYR_UPPER + EN_LOWER + EN_UPPER + DIGITS + ' _-'

translit_table = (
    ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х',
     'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л',
     'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', '̆'],
    ['a', 'b', 'v', 'g', 'd', 'e', 'e', 'zh', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h',
     'z', 'ch', 'sh', 'sch', '_', 'y', '_', 'e', 'yu', 'ya', 'A', 'B', 'V', 'G', 'D', 'E', 'E', 'ZH', 'Z', 'I', 'J',
     'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'Z', 'CH', 'SH', 'SCH', '_', 'Y', '_', 'E', 'YU', 'YA',
     '_']
)

teachers_names = {
    'Н.В.Андреева': 'nv-andreeva',
    'И.Н.Втюрина': 'in-vturina',
    'О.Д.Гоголева': 'od-gogoleva',
    'В.А.Саржин': 'va-sarzhin',
    'Р.К.Тимашев': 'rk-timashev',
    'А.С.Тимашева': 'as-timasheva',
}

image_processing = True
image_save_dir = './static_images'

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

sync_provider_type = os.environ['SYNC_PROVIDER']

_providers_roots = {
    'fs': abs_fn('/Users/tmshv/Yandex.Disk'),
    'yd': abs_fn('/'),
}
f = _providers_roots[sync_provider_type]

dir_documents = f('Hudozka/Site/Documents')
dir_events = f('Hudozka/Site/Events')
dir_news = f('Hudozka/Site/News')

dir_static_uploads = '/Users/tmshv/Desktop/Hudozka Static/uploads'
dir_static_images = '/Users/tmshv/Desktop/Hudozka Static/images'
url_base_preview = 'https://static.shburg.org/art/images/{id}-{size}{ext}'
url_base_document = 'https://static.shburg.org/art/uploads/{file}'

image_base_url = 'https://static.shburg.org/art/images/'
image_name_format = '{type}-{id}-{img}-{size}{ext}'
image_output = '/Users/tmshv/Desktop/Hudozka Static/images'

yandex_disk_access_token = os.environ['YANDEX_DISK_ACCESS_TOKEN']
