import settings
from db import collection
from sync.core.person import SyncPerson
from utils.text.transform import interpolate_swift


def resolve_value(param, store):
    """

    :param param: \(nv-andreeva)
    :param store: function should return value by key nv-andreeva
    :return:
    """
    i = interpolate_swift(param)
    return store(i)


def resolve_teacher(i):
    sync = SyncPerson(
        collection(settings.collection_collective),
        None,
        ''
    )
    return resolve_value(i, lambda teacher_id: sync.read({'id': teacher_id}))


def create_product(doc):
    # author, image, title, awards, teacher, date

    # unpop_image = key_mapper('image', lambda i: sync_image(i)['_id'])
    # unpop_teacher = key_mapper('teacher', lambda i: i['_id'])

    product = {**doc}
    # unpop_image(product)

    # product['teacher'] = resolve_teacher(doc['teacher'])
    # if (product['teacher']):
        # unpop_teacher(product)

    return product
