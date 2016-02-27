from db import db
from utils.fn import lmap


def sync_image(record):
    if isinstance(record, list):
        return lmap(
            sync_image,
            record
        )

    q = {'hash': record['hash']}
    try:
        db().images.update_one(q, {'$set': record}, upsert=True)
        i = db().images.find_one({'hash': record['hash']})
        return i
    except ValueError:
        pass

    return None
