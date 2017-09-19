import logging

import settings
from sync import untouched
from sync.data import Provider


def get_id(item):
    try:
        return item.id
    except AttributeError:
        return item['id']


class Sync:
    def __init__(self, provider: Provider, model):
        super().__init__()

        self.__default_build_args = {
            'sizes': settings.image_sizes,
        }
        self.__items_to_delete_query = lambda items_id: {'id': {'$nin': items_id}}
        self.__delete_query = lambda item: {'_id': item['_id']}

        name = model.__name__
        self.logger = logging.getLogger('%s.%s' % (settings.name, name))

        self.provider = provider
        self.model = model

    async def clean(self):
        pass

    async def update(self, item):
        args = self._get_build_args()

        await item.build(**args)
        await item.upload()
        await item.save()

    def _get_build_args(self):
        return {
            **self.__default_build_args
        }

    async def run(self):
        """
        # Get scope files
        # Validate these files. Raise an error
        # calc_hashes
        # make diff with previous run
        # compile objects
        # upload

        :return:
        """
        self.logger.info('Checking for update')

        items = await self.model.scan(self.provider)
        items_id = [doc.id for doc in items]
        self.logger.info('Found {} Item(s)'.format(len(items)))

        # SKIP UNTOUCHED DOCUMENTS
        items = await untouched(items)
        self.logger.info('Changed {} Items(s)'.format(len(items)))

        # UPDATING
        if settings.update_enabled:
            for item in items:
                await self.update(item)
                self.logger.info('Updated Item {}'.format(item))

        # DELETING
        if settings.delete_enabled:
            items = await self.model.find(self.__items_to_delete_query(items_id))
            items = list(items)

            for item in items:
                self.logger.info('Deleting Item {}'.format(item['id']))
                await self.model.delete(self.__delete_query(item))

        await self.clean()

    async def upload(self):
        pass
