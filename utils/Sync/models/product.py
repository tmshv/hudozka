from sync.image import sync_image
from sync.teacher import Teacher
from utils.fn import key_mapper
from utils.text.transform import interpolate_swift


def resolve_value(param, store):
    """

    :param param: \(nv-andreeva)
    :param store: function should return value by key nv-andreeva
    :return:
    """
    i = interpolate_swift(param)
    return store(i)


unpop_image = key_mapper('image', lambda i: sync_image(i)['_id'])



def resolve_teacher(i):
    sync = Teacher()
    return resolve_value(i, lambda i: sync.read({'id': i}))


def create_product(doc):
    # author, image, title, awards, teacher, date

    unpop_teacher = key_mapper('teacher', lambda i: i['_id'])

    product = {**doc}
    unpop_image(product)

    product['teacher'] = resolve_teacher(doc['teacher'])
    if(product['teacher']):
        unpop_teacher(product)

    return product
