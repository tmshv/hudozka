import os

import logging

import settings
from sync import untouched
from sync.core import Sync
from sync.data import Provider
from sync.models.Page import Page

from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Page')


class SyncPage(Sync):
    def __init__(self, provider: Provider, collection):
        super().__init__(provider, collection)

    async def clean(self):
        pass

    async def run(self):
        logger.info('Checking for update')

        documents = await Page.scan(self.provider)
        documents_id = [doc.id for doc in documents]
        # self.validate(documents)
        logger.info('Found {} Page(s)'.format(len(documents)))

        # SKIP UNTOUCHED DOCUMENTS
        documents = await untouched(documents)
        logger.info('Changed {} Pages(s)'.format(len(documents)))

        # UPDATING
        if settings.update_enabled:
            if len(documents) == 0:
                logger.info('No Pages to update')

            for document in documents:
                logger.info('Updating Page {}'.format(document.id))

                await document.setup_images(settings.image_sizes, get_image_url_fn(document.id))
                await document.save()

                logger.info('Updated Page {}'.format(document.id))

        # DELETING
        if settings.delete_enabled:
            documents_delete = list(self.query({'id': {'$nin': documents_id}}))

            if len(documents_delete) == 0:
                logger.info('No Pages to delete')
            else:
                for document in documents_delete:
                    logger.info('Deleting Page {}'.format(document['id']))

                    q = {'_id': document['_id']}
                    self.delete(q)

        await self.clean()


def get_image_url_fn(page_id: str):
    image_id = lambda filename: url_encode_text(
        os.path.splitext(filename)[0]
    )

    def img_url_fn(file, size, ext):
        return settings.page_url_base.format(
            page=page_id,
            id=image_id(file),
            size=size,
            ext=ext
        )

    return img_url_fn
