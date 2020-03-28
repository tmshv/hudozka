import os
import re
from datetime import datetime

import lxml.html
import kazimir
import settings
from kazimir.CSVToken import CSVToken
from kazimir.DocumentToken import DocumentToken
from kazimir.YoutubeToken import YoutubeToken
from kazimir.InstagramToken import InstagramToken
from kazimir.Marker import Marker
from kazimir.Token import TokenFactory, SplitToken, UrlToken, ImageToken, BuildTokenFactory, TextToken, HtmlToken
from sync.data import Provider
from sync.models import Model
from sync.models.Document import Document
from sync.models.Image import Image


def create_date(date_str, date_formats=None):
    """
    2016
    2016.10
    2016.10.10
    -> datetime

    :param date_formats:
    :param date_str:
    :return:
    """
    if not date_formats:
        date_formats = [
            '%Y',
            '%Y.%m',
            '%Y.%m.%d'
        ]

    for date_format in date_formats:
        try:
            return datetime.strptime(date_str, date_format)
        except:
            continue
    return None


async def untouched(items: [Model]) -> [Model]:
    if settings.skip_unchanged:
        return items

    result = []
    for item in items:
        status = await item.is_changed()
        if status:
            result.append(item)
    return result

    # def is_equals(e, n):
    #     return (n is None) or ('hash' not in n) or (e.hash != n['hash'])
    #
    # doc = lambda i: {'id': i.id, 'hash': i.hash}
    #
    # stored_documents = [(i, store.read(doc(i))) for i in documents]
    # filtered_documents = [i[0] for i in stored_documents if is_equals(*i)]

    # return filtered_documents


async def create_post(provider: Provider, folder: str, md: str, sizes):
    images = []
    documents = []

    def rel(file: str) -> str:
        return os.path.join(folder, file)

    async def build_document(data):
        filepath = os.path.join(folder, data['file'])
        document = await Document.new(provider, filepath, settings.image_sizes)

        title = data['caption']
        if title:
            document.set_title(title)
            await document.save()

        if not document:
            raise Exception(f'Failed to build Document {filepath}')

        text = data['caption'] if data['caption'] else data['file']
        url = f'/document/{document.id}'

        image_url = document.preview.get_src()

        return {
            'url': url,
            'slug': document.id,
            'image_url': image_url,
            'file_url': document.url,
            'title': document.title,
            'file_size': document.file_size,
            'file_format': 'application/pdf',
        }

    async def build_image(data):
        filename = data['file']
        relative_path = os.path.join(folder, filename)
        image_path = provider.get_local(relative_path)
        if os.path.exists(image_path):
            image = await Image.new(provider, relative_path, sizes)
            if image:
                images.append(image)

                src = image.get_src()
                return {
                    'src': src,
                    'alt': data['caption'],
                    'caption': data['caption'],
                }
        raise Exception('Fail to get Image', relative_path)

    async def read_file(data):
        filepath = data
        filepath = rel(filepath)

        return provider.read(filepath).read().decode('utf-8')

    m = Marker()
    m.add_token_factory(TokenFactory(SplitToken))
    m.add_token_factory(TokenFactory(YoutubeToken))
    m.add_token_factory(TokenFactory(InstagramToken))
    m.add_token_factory(TokenFactory(UrlToken))
    m.add_token_factory(BuildTokenFactory(ImageToken, build=build_image))
    m.add_token_factory(BuildTokenFactory(DocumentToken, build=build_document))
    m.add_token_factory(BuildTokenFactory(CSVToken, build=read_file))
    # m.add_token_factory(TokenFactory(FileToken))
    m.add_token_factory(TokenFactory(HtmlToken))
    m.add_token_factory(TokenFactory(TextToken))

    tokens = m.parse(md)

    encoded_tokens = []
    for t in tokens:
        data = await t.get_data()
        encoded_tokens.append({
            'token': t.name,
            'data': data,
        })

    return images, documents, encoded_tokens
