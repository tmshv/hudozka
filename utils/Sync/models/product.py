from sync.image import sync_image
from utils.fn import key_mapper


unpop_image = key_mapper('image', lambda i: sync_image(i)['_id'])


def create_product(doc):
    # author, image, title, awards, teacher, date

    product = {**doc}
    unpop_image(product)

    return product
