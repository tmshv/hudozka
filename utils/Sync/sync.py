import settings
from sync.core.document import pdf_to_jpg
from sync.data.fs import FSProvider
from sync.data.yandexdisk import YDProvider
from sync.document import sync_documents
from utils.fn import lprint_json
from utils.image.resize import image_magick_pdf_to_img
from yandexdisk import YDClient


def get_provider(provider_type, root):
    if provider_type == 'fs':
        return FSProvider(root)
    elif provider_type == 'yd':
        return YDProvider(root, settings.yandex_disk_access_token)
    return None


if __name__ == '__main__':
    provider = get_provider(settings.sync_provider_type, settings.dir_documents)

    update = False
    delete = False

    if provider:
        u, d = sync_documents(provider, update=update, delete=delete)
        print('DELETE DOCUMENTS: %s' % ('NO' if not delete else str(len(d))))
        lprint_json(d)

        print('UPDATE DOCUMENTS: %s' % ('NO' if not update else str(len(u))))
        lprint_json(u)


        # print(api.scan('.'))
        # print(list(filter(
        #     lambda i: api.is_dir(i),
        #     api.scan('.')
        # )))

        # print(api.hash('./Архив/Устав 2013.pdf'))
        # print(api.size('./Архив/Устав 2013.pdf'))

        # print(api.glob('./Архив/*.pdf'))
        # print(api.type_filter('./Архив', '.pdf'))

        # path = api.type_filter('./Архив', '.pdf')[0]
        # print(api.copy(path, '/Users/tmshv/Desktop/fafo'))
