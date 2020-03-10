import logging
import settings
from sync import untouched


class Sync:
    def __init__(self, ctrl, name: str):
        super().__init__()

        self.validate_urls = True
        self.strict_origin = False
        self.__default_build_args = {
            'sizes': settings.image_sizes,
        }
        self.__delete_query = lambda item: {'_id': item['_id']}

        self.logger = logging.getLogger('%s.%s' % (settings.name, name))

        self.ctrl = ctrl
        self.filter_item_fn = lambda x: True

        self.skip_unchanged = True
        self.update_enabled = True
        self.delete_enabled = True

    def set_options(self, su: bool, u: bool, d: bool):
        self.skip_unchanged = su
        self.update_enabled = u
        self.delete_enabled = d
        return self

    def set_item_filter(self, fn):
        self.filter_item_fn = fn
        return self

    async def build(self, item):
        args = self._get_build_args()
        await item.build(**args)
        return item

    async def update(self, item):
        await item.upload()
        await item.save()
        return item

    def _get_build_args(self):
        return {
            **self.__default_build_args
        }

    def __items_to_delete_query(self, items):
        query = {
            'id': {'$nin': [doc.id for doc in items]},
        }

        if self.strict_origin:
            items_origin = list(set([doc.origin for doc in items]))

            query = {
                **query,
                'origin': {'$in': items_origin},
            }

        return query

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

        items = await self.ctrl.get_items()
        self.logger.info('Found {} Item(s)'.format(len(items)))
        all_items = items

        if self.validate_urls:
            self.check_urls_uniqueness(all_items)

        # SKIP UNTOUCHED DOCUMENTS
        if self.skip_unchanged:
            items = await untouched(all_items)

        # Optionally trim list of models by custom filter
        items = [
            x
            for x in items
            if self.filter_item_fn(x)
        ]

        self.logger.info(f'Ready to process {len(items)} item(s)')

        # BUILDING
        for item in items:
            self.logger.info(f'Build Item {item}')
            await self.build(item)

        # UPDATING
        if self.update_enabled:
            for item in items:
                await self.update(item)
                self.logger.info('Updated Item {}'.format(item))

        # DELETING
        if self.delete_enabled:
            obsolete_items = await self.ctrl.find(self.__items_to_delete_query(all_items))
            for item in obsolete_items:
                self.logger.info('Deleting Item {}'.format(item['id']))
                await self.ctrl.delete_item(self.__delete_query(item))

    def check_urls_uniqueness(self, items):
        urls = [x.url for x in items]
        unique_urls = set(urls)

        if len(urls) != len(unique_urls):
            self.logger.error('URLs is not unique')
            raise Exception('URLs is not unique')
