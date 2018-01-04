quote_pairs = [
    ('"', '"'),
    ('«', '»'),
]


async def fix_links_quotes(tree):
    safe = lambda x: x if x else ''

    for link in tree.iterlinks():
        a = link[0]
        if a.tag != 'a':
            continue

        quote = get_quote_pair(a.text)
        if not quote:
            continue

        # New text of A without quotes
        a.text = a.text[1:-1]

        # Move first quote out of A to the prefix
        a.getparent().text = safe(a.getparent().text) + quote[0]

        # Move last quote out of A to the suffix
        a.tail = quote[1] + safe(a.tail)

    return tree


def get_quote_pair(text: str):
    """
    sample text -> [s]ample tex[t] -> (s, t) -> match pair from quote_pair
        ? (s, t)
        : None

    :param text:
    :return:
    """
    if len(text) < 2:
        return None

    first = text[0]
    last = text[-1]

    for pair_first, pair_last in quote_pairs:
        if pair_first == first and pair_last == last:
            return first, last

    return None
