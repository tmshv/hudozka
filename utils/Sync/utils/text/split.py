from utils.fn import until


def split(data, separator=' '):
    try:
        s = data.index(separator)
        return data[:s], data[s:]
    except ValueError:
        return None, None


def split_with(separators):
    return lambda data: until(
        lambda i: i[0] and i[1],
        lambda s: split(data, s),
        separators,
        (None, None)
    )
