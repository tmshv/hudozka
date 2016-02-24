from PIL import Image


def read_image(src):
    try:
        return Image.open(src)
    except FileNotFoundError:
        return None