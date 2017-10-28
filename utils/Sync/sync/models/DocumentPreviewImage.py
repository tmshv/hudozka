import os
from tempfile import mkstemp

from sync.models.Image import Image, default_url_factory
from utils.hash import md5
from utils.image import image_magick_pdf_to_img


class DocumentPreviewImage(Image):
    @staticmethod
    async def find_one(query):
        return await Image.find_one(query)

    @staticmethod
    async def find(query):
        return await Image.find(query)

    @staticmethod
    async def delete(query):
        return await Image.delete(query)

    @staticmethod
    async def new(provider, file, sizes, **kwargs):
        img = DocumentPreviewImage(provider, file, data=None)
        changed = await img.is_changed()
        if changed:
            await img.build(sizes=sizes)
            await img.upload()
            await img.save()
        else:
            doc = await DocumentPreviewImage.find_one({'file': file})
            img = DocumentPreviewImage(provider, file, doc['data'])
            img.ref = doc['_id']

        return img

    def __init__(self, provider, file, data):
        super().__init__(provider, file, data, url_factory=default_url_factory)
        self.__hash_salt = ''
        self.temp_image_path = None

    async def is_changed(self):
        i = await DocumentPreviewImage.find_one({'file': self.file})
        return self._is_changed_hash(i)

    async def build(self, sizes):
        self.temp_image_path = await pdf_to_jpg(self.provider, self.file)
        await super().build(sizes)

    def _get_image_file(self):
        return self.temp_image_path

    def __get_id(self):
        return md5(self.file)

    def __get_hash(self):
        return self.provider.hash(self.file)


async def pdf_to_jpg(provider, pdf):
    _, temp_in = mkstemp(suffix='.pdf')
    _, temp_out = mkstemp(suffix='.jpg')

    abspdf = provider.copy(pdf, temp_in)
    await image_magick_pdf_to_img(abspdf, temp_out)

    os.remove(temp_in)
    return temp_out
