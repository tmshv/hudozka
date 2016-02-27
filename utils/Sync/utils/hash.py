import hashlib


def file_hash(file):
    with open(file, 'rb') as f:
        data = f.read()
        sha = hashlib.sha256(data)
        f.close()
        return sha.hexdigest()