__author__ = 'Roman Timashev'


class Product:
    def __init__(self, author_name, author_age, image, product_title):
        super().__init__()
        self.author_name = author_name
        self.author_age = author_age
        self.image = image
        self.product_title = product_title
        self.image_original_path = None

    def to_tuple(self):
        return self.author_name, self.author_age, self.image, self.product_title, self.image_original_path
