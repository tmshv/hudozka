__author__ = 'Roman Timashev'


class Album:
    def __init__(self, type, title, uri, course, course_uri, date, teacher, comment):
        super().__init__()
        self.products = []
        self.type = type
        self.title = title
        self.uri = uri
        self.course = course
        self.course_uri = course_uri
        self.date = date
        self.teacher = teacher
        self.comment = comment

    def add_product(self, product):
        self.products.append(product)

    def __repr__(self, *args, **kwargs):
        return '[%s by %s (%d items)]' % (self.title, self.teacher, len(self.products))

