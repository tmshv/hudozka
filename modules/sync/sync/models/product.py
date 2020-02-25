import settings
from db import collection
from utils.text.transform import interpolate_swift


def resolve_value(param, store):
    """

    :param param: \(nv-andreeva)
    :param store: function should return value by key nv-andreeva
    :return:
    """
    i = interpolate_swift(param)
    return store(i)



def create_product(doc):
    # author, image, title, awards, teacher, date

    # unpop_image = key_mapper('image', lambda i: sync_image(i)['_id'])
    # unpop_teacher = key_mapper('teacher', lambda i: i['_id'])

    product = {**doc}
    # unpop_image(product)

    return product
