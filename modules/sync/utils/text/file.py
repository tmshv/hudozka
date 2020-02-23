import os

import math


def default_ext(ext: str):
    return ext.upper()


def get_ext(filename):
    ext_s = ['.png', '.pdf', '.jpg', '.jpeg', '.gif', '.doc']
    ext_d = ['ПНГ', 'ПДФ', 'ЖПГ', 'ЖПГ', 'ГИФ', 'ДОК']

    _, ext = os.path.splitext(filename)

    if ext in ext_s:
        i = ext_s.index(ext)
        return ext_d[i]
    else:
        default_ext(ext)


def get_size(number_of_bytes, precision=1):
    units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ']

    number = math.floor(math.log(number_of_bytes) / math.log(1024))
    size = (number_of_bytes / math.pow(1024, math.floor(number)))
    size = round(size, precision)
    return f'{size} {units[number]}'
