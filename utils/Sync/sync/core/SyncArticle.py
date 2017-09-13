import os

import logging

import settings
from sync import untouched
from sync.core import Sync
from sync.data import Provider
from sync.models.Article import Article
from sync.models.Person import Person

from utils.text.transform import url_encode_text

logger = logging.getLogger(settings.name + '.Article')


class SyncArticle(Sync):
    async def run(self):
        logger.info('Checking for update')

        documents = await Article.scan(self.provider)
        documents_id = [doc.id for doc in documents]
        # self.validate(documents)
        logger.info('Found {} Item(s)'.format(len(documents)))

        # SKIP UNTOUCHED DOCUMENTS
        documents = await untouched(documents)
        logger.info('Changed {} Items(s)'.format(len(documents)))

        # UPDATING
        if settings.update_enabled:
            if len(documents) == 0:
                logger.info('No Items to update')

            for document in documents:
                logger.info('Updating Item {}'.format(document.id))

                await document.build(
                    sizes=settings.image_sizes,
                )
                await document.save()

                logger.info('Updated Item {}'.format(document.id))

        # DELETING
        if settings.delete_enabled:
            documents_delete = list(self.query({'id': {'$nin': documents_id}}))

            if len(documents_delete) == 0:
                logger.info('No Items to delete')
            else:
                for document in documents_delete:
                    logger.info('Deleting Item {}'.format(document['id']))

                    q = {'_id': document['_id']}
                    self.delete(q)

        # await self.clean()