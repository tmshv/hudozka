from yaml import load as yaml
from toml import loads as toml_str

from sync import untouched
from sync.core.schedule import SyncSchedule
from sync.data import scan_subdirs, get_data
from utils.fn import lmap, constant
from utils.io import read_yaml

dir_documents = '/Users/tmshv/Dropbox/Dev/Hud school/Schedules'


def sync_schedules(provider, collection, update=True, delete=True):
    """
    :param provider:
    :param update:
    :param delete:
    :return:
    """

    return main(
        SyncSchedule(
            collection,
            provider
        ),
        update_documents=update,
        delete_documents=delete
    )


def combine(fns):
    def call(value):
        data = value.read()
        for f in fns:
            try:
                return f(data)
            except Exception as e:
                pass
        return None
    return call


def toml(bytes_value):
    s = bytes_value.decode('utf-8')
    return toml_str(s)


def main(sync, update_documents=False, delete_documents=False):
    # COLLECT YAML/MD/JPG/PDF MANIFEST FILES
    documents = sync.provider.type_filter('.', '.yaml')
    documents += sync.provider.type_filter('.', '.toml')

    # READ MANIFEST
    documents = lmap(
        lambda i: {
            'file': i,
            **get_data(sync.provider, i, combine([yaml, toml, constant({})]))
        },
        documents
    )

    # CREATE DOCUMENT IDENTITY
    documents = lmap(sync.create_id, documents)

    # CREATE DOCUMENT HASH
    documents = lmap(sync.create_hash, documents)

    # CREATE SCOPE OF CURRENT SESSION
    # ALL DOCUMENTS IDS FOUNDED
    scope_documents_ids = lmap(
        lambda i: i['id'],
        documents
    )

    # SKIP UNTOUCHED DOCUMENTS
    documents = untouched(documents, sync)

    # DO HEAVY PROCESS WITH DOCUMENTS

    # SYNC SCHEDULE
    if update_documents:
        documents = lmap(
            sync.update,
            documents
        )

    documents_to_remove = sync.query({'id': {'$nin': scope_documents_ids}})
    if delete_documents:
        documents_to_remove = lmap(
            sync.delete,
            map(
                lambda i: {'_id': i['_id']},
                documents_to_remove
            )
        )

    return documents, documents_to_remove
