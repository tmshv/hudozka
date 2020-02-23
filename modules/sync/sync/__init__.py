import os
import re
from datetime import datetime

import lxml.html
from markdown import markdown

import kazimir
import settings
from kazimir.CSVToken import CSVToken
from kazimir.DocumentToken import DocumentToken
from kazimir.YoutubeToken import YoutubeToken
from kazimir.InstagramToken import InstagramToken
from kazimir.Marker import Marker
from kazimir.Token import TokenFactory, SplitToken, UrlToken, ImageToken, BuildTokenFactory, TextToken
from sync.data import Provider
from sync.models import Model
from sync.models.Document import Document
from sync.models.Image import Image
from utils.text.file import get_size
from utils.text.file import get_ext


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


# 2016 На крыльях бабочек
# 2016.10 На крыльях бабочек
# 2016.10.10 На крыльях бабочек
folder_name_pattern = re.compile('([\d.]+)(.*)')


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


def create_date_and_title_from_folder_name(folder_name, date_formats=None):
    m = folder_name_pattern.findall(folder_name)
    if not m:
        return None, None

    date_str, title = m[0]
    title = os.path.splitext(title.strip())[0]
    date = create_date(date_str, date_formats)

    if not date:
        return None, title

    return date, title


async def create_post(provider: Provider, folder: str, md: str, sizes):
    from kazimir.fix_links_quotes import fix_links_quotes

    images = []
    documents = []

    def rel(file: str) -> str:
        return os.path.join(folder, file)

    async def build_document(data):
        filepath = os.path.join(folder, data['file'])
        document = await Document.new(provider, filepath, settings.image_sizes)

        if not document:
            raise Exception(f'Failed to build Document {filepath}')

        text = data['caption'] if data['caption'] else data['file']
        url = f'/document/{document.id}'

        image_url = document.preview.get_size('small')['url']

        return {
            'url': url,
            'image_url': image_url,
            'file_url': document.url,
            'title': document.title,
            'file_size': get_size(document.file_size, 1),
            'file_format': get_ext(data['file']),
        }

    async def build_image(data):
        src = data['file']
        relative_image_path = os.path.join(folder, src)

        image_path = provider.get_local(relative_image_path)
        if os.path.exists(image_path):
            image = await Image.new(provider, relative_image_path, sizes)
            if image:
                url = image.get_size('big')['url']
                images.append(image)

                return {
                    'src': url,
                    'alt': data['caption'],
                    'caption': data['caption'],
                }
        raise Exception('Fail to get Image', relative_image_path)

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
    m.add_token_factory(TokenFactory(TextToken))
    m.add_tree_middleware(fix_links_quotes)
    tree = await m.create_tree(md)

    post = kazimir.html_from_tree(tree)
    post = await kazimir.typo(post)

    return post, images, documents


def images_from_html(md):
    if not md:
        return []

    post_html = lxml.html.fromstring(md)

    images = []
    for img in post_html.cssselect('img'):
        src = img.get('src')
        images.append(src)
    return images


def title_from_html(md):
    html = lxml.html.fromstring(md)
    titles = html.cssselect('h1')
    if len(titles):
        return titles[0].text


create_post_from_image_list = lambda images: markdown(
    '\n'.join(map(
        lambda i: '![]({img})'.format(img=i),
        images
    ))
)
