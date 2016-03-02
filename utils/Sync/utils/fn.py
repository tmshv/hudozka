import json
import os
from functools import reduce
from glob import glob

from bson import json_util

combine = lambda i: reduce(
    lambda s, i: s + i,
    i
)

iterate_over_fns = lambda fns: lambda i: reduce(
    lambda out, fn: fn(out),
    fns, i
)

iterate_iter_over_fns = lambda fns: lambda i: lmap(
    iterate_over_fns(fns),
    i
)

lmap = lambda fn, ls: list(map(fn, ls))
lprint = lambda i: lmap(print, i)
lprint_json = lambda s: lprint(lmap(
    lambda i: json.dumps(i, ensure_ascii=False, indent=4, default=json_util.default),
    s
))

first = lambda i: i[0] if len(i) > 0 else None


def ext(ext):
    return lambda i: os.path.splitext(i)[0] + ext


def map_item_key(item, key, map_fn):
    """

    :param item:
    :param key:
    :param map_fn:
    :return:
    """
    item[key] = map_fn(item[key])
    return item


def kmap(key):
    return lambda i: i[key] if key in i else None


def key_mapper(key, fn):
    return lambda i: map_item_key(i, key, fn)


def map_cases(param, cases, default_fn=None):
    for c, fn in cases:
        if c(param):
            return fn(param)
    return param if not default_fn else default_fn(param)


def until(condition_fn, iter_fn, items, default_value=None):
    for i in items:
        result = iter_fn(i)
        if condition_fn(result):
            return result
    return default_value


# glob_in = dir_globber(['*.jpg', '*.JPG', '*.png', '*.PNG'])
# glob_in('./images')
dir_globber = lambda mask_list: lambda dir: combine(map(
    lambda mask: glob(os.path.join(dir, mask)),
    mask_list
))
