import hashlib

from utils.fn import map_cases, to_json


def hash_file(file):
    with open(file, 'rb') as f:
        data = f.read()
        return hash_data(data)


def hash_data(data):
    sha = hashlib.sha256(data)
    return sha.hexdigest()


def hash_str(data):
    data = map_cases(data, [
        (lambda i: isinstance(i, dict), to_json),
        (lambda i: isinstance(i, tuple), to_json),
        (lambda i: isinstance(i, list), to_json),
        (lambda i: isinstance(i, int), int),
        (lambda i: isinstance(i, float), float),
    ])
    if isinstance(data, dict):
        data = to_json(data)

    return hash_data(str(data).encode())


def md5(data: str) -> str:
    i = hashlib.md5(data.encode('utf-8'))
    return i.hexdigest()
