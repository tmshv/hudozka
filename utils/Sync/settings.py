__author__ = 'Roman Timashev'

root_dir_gallery = './Gallery'
root_dir_schedule = './Schedules'

default_description_version = 1

database_uri = 'mongodb://localhost/hudozka'

CYR_LOWER = 'йцукенгшщзхъфывапролджэячсмитьбю'
CYR_UPPER = 'ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'
EN_LOWER = 'qwertyuiopasdfghjklzxcvbnm'
EN_UPPER = 'QWERTYUIOPASDFGHJKLZXCVBNM'
DIGITS = '0123456789'
description_available_chars = CYR_LOWER + CYR_UPPER + EN_LOWER + EN_UPPER + DIGITS + ' _-'

translit_table = (
    'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
    'abvgdeejzijklmnoprstufhzcss_y_euaABVGDEEJZIJKLMNOPRSTUFHZCSS_Y_EUA'
)

teachers_names = {
    'Н.В.Андреева': 'nv-andreeva',
    'И.Н.Втюрина': 'in-vturina',
    'О.Д.Гоголева': 'od-gogoleva',
    'В.А.Саржин': 'va-sarzhin',
    'Р.К.Тимашев': 'rk-timashev',
    'А.С.Тимашева': 'as-timasheva',
    # '': '',
}

image_processing = True
image_save_dir = './static_images'

image_base_url = 'https://static.shburg.org/art/image/'
collective_image_base_url = 'https://static.shburg.org/art/collective/'
collective_image_output = '/Users/tmshv/Dropbox/Dev/Hud School/Static/collective'

image_ext = '.jpg'
image_sizes = [
    ('original', None, None),
    ('big', 1500, 667),
    ('medium', 400, 300),
    ('small', 250, 175),
    ('little', 100, 100),
    ('preview', 50, 50),
]

date_formats = [
    '%Y',
    '%m.%Y',
    '%d.%m.%Y',
    '%d.%m.%Y %H:%M',
    '%d.%m.%Y %H:%M:%S'
]
