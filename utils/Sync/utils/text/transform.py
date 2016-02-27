import re
from functools import reduce

import settings
from utils.fn import iterate_over_fns


def translit(text):
    """
    RUSSIAN TEXT => ENGLISH TEXT
    based on table like:
    (
        ['а', 'б', 'в'],
        ['a', 'b', 'v']
    )
    Leave if character is not founded
    """
    table = settings.translit_table
    ins, outs = table
    out = lambda i: outs[ins.index(i)]
    replace = lambda i: out(i) if i in ins else i

    return reduce(
        lambda t, i: t + replace(i),
        list(text),
        ''
    )


def interpolate(text, storage, key_fn=None):
    if not key_fn:
        key_fn = lambda i: i

    key = key_fn(text)
    return storage[key] if key in storage else text


interpolate_swift = lambda i: re.search("([\d\w-]+)", i).group(1)

remove_pattr = re.compile('[«»,!&]')
remove_punctuation = lambda i: remove_pattr.sub('', i)

space_to_dash = lambda i: i.replace(' ', '-')
dot_to_dash = lambda i: i.replace('.', '-')
remove_underscores = lambda i: i.replace('_', '')
text_lower = lambda i: i.lower()

url_encode_file = iterate_over_fns([translit, space_to_dash, remove_underscores, remove_punctuation, text_lower])
url_encode_text = iterate_over_fns(
    [translit, space_to_dash, dot_to_dash, remove_underscores, remove_punctuation, text_lower])
