import re
from datetime import datetime

from markdown import markdown

from db import db
from utils.fn import lmap, key_mapper


def create_date(date_str, date_formats=None):
    """
    2016
    2016.10
    2016.10.10
    -> datetime

    :param date_str:
    :return:
    """
    if not date_formats:
        date_formats = [
            '%Y',
            '%Y.%m',
            '%Y.%m.%d'
        ]

    for format in date_formats:
        try:
            return datetime.strptime(date_str, format)
        except:
            continue
    return None


# 2016 На крыльях бабочек
# 2016.10 На крыльях бабочек
# 2016.10.10 На крыльях бабочек
folder_name_pattern = re.compile('([\d.]+)(.*)')


def untouched(documents, store):
    return lmap(
        lambda i: i[0],
        filter(
            lambda i: (i[1] is None) or ('hash' not in i[1]) or (i[0]['hash'] != i[1]['hash']),
            map(
                lambda i: (i, store.read(i)),
                documents
            )
        ))


def create_date_and_title_from_folder_name(folder_name, date_formats=None):
    m = folder_name_pattern.findall(folder_name)
    if not m:
        return None, None

    date_str, title = m[0]
    title = title.strip()
    date = create_date(date_str, date_formats)

    if not date:
        return None, title

    return date, title


create_post_from_image_list = lambda images: markdown(
    '\n'.join(map(
        lambda i: '![]({img})'.format(img=i),
        images
    ))
)


class Sync:
    def __init__(self):
        super().__init__()

        self.collection = None

    def read(self, document):
        if isinstance(document, list):
            return lmap(self.read, document)

        q = {'id': document['id']}
        try:
            return self.collection.find_one(q)
        except ValueError:
            pass
        return None

    def update(self, document):
        if isinstance(document, list):
            return lmap(self.update, document)

        q = {'id': document['id']}
        try:
            self.collection.update_one(q, {'$set': document}, upsert=True)
            return self.read(document)
        except ValueError:
            pass
        return None

    def compile(self, document):
        return document

    def query(self, q):
        return self.collection.find(q)

    def delete(self, q):
        return self.collection.find_one_and_delete(q)

    def create_id(self, document):
        return None

    def create_hash(self, document):
        return None
