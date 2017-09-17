import os
from functools import reduce


def constant(value):
    return lambda _: value


def combine(items):
    if len(items) == 0:
        return []

    return reduce(
        lambda total, i: total + i,
        items
    )


def compose(*fns):
    return lambda i: reduce(
        lambda out, fn: fn(out),
        fns, i
    )


first = lambda i: i[0] if len(i) > 0 else None


def swap_ext(extension: str):
    return lambda i: os.path.splitext(i)[0] + extension


def map_cases(param, cases):
    for predicate, fn in cases:
        if predicate(param):
            return fn(param)
    return param


def until(condition_fn, iter_fn, items, default_value=None):
    for i in items:
        result = iter_fn(i)
        if condition_fn(result):
            return result
    return default_value


def last_good(ls):
    better = None
    for i in ls:
        if (i is not None) and i != '':
            better = i
    return better
