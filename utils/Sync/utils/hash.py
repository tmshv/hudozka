import hashlib
import json

from utils.fn import map_cases


def hash_file(file):
    with open(file, 'rb') as f:
        data = f.read()
        return hash_data(data)


def hash_data(data):
    sha = hashlib.sha256(data)
    return sha.hexdigest()


def hash_str(data):
    to_json = lambda i: json.dumps(i, sort_keys=True)
    data = map_cases(data, [
        (lambda i: isinstance(i, dict), to_json),
        (lambda i: isinstance(i, tuple), to_json),
        (lambda i: isinstance(i, list), to_json),
        (lambda i: isinstance(i, int), int),
        (lambda i: isinstance(i, float), float),
    ])
    if isinstance(data, dict):
        data = json.dumps(data, sort_keys=True)

    return hash_data(str(data).encode())
