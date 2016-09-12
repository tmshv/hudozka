import os
from tempfile import mkstemp

from utils.image import create_image
from utils.image.resize import image_magick_pdf_to_img
from utils.text.transform import url_encode_text


class Preview:
    def __init__(self, provider, url_base, output, sizes):
        super().__init__()
        self.provider = provider
        self.url_base = url_base
        self.output = output
        self.sizes = sizes

    def create(self, file):
        def url(size, ext):
            return self.url_base.format(id=file, size=size, ext=ext)

        temp_preview_path = self.pdf_to_jpg(file)
        file = os.path.basename(file)
        file = url_encode_text(file)
        img = create_image(temp_preview_path, self.sizes, url, self.output)
        os.remove(temp_preview_path)
        return img

    def pdf_to_jpg(self, pdf):
        _, temp_in = mkstemp(suffix='.pdf')
        _, temp_out = mkstemp(suffix='.jpg')

        abspdf = self.provider.copy(pdf, temp_in)
        image_magick_pdf_to_img(abspdf, temp_out)

        os.remove(temp_in)
        return temp_out
