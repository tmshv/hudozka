import os
import re
from markdown import markdown
from urllib.parse import urlparse

image_extensions = ['.jpg', '.jpeg', '.png']
document_extensions = ['.doc', '.docx', '.pdf', '.xls', '.xlsx']


class TokenFactory:
    def __init__(self, token) -> None:
        super().__init__()
        self.token = token

    def create(self, data):
        return self.token(data=data)


class BuildTokenFactory(TokenFactory):
    def __init__(self, token, build) -> None:
        super().__init__(token)
        self.build = build

    def create(self, data):
        x = self.token(data=data)
        x.build = self.build
        return x


class Token:
    @staticmethod
    def test(data: str):
        return True

    def __init__(self, name, data) -> None:
        super().__init__()
        self.name = name
        self.data = data
        self.joinable = True

    async def compile(self):
        return str(self.data)

    def merge(self, token):
        return self

    def __repr__(self) -> str:
        return f'[Token {self.name} {self.data}]'


class SplitToken(Token):
    @staticmethod
    def test(data: str):
        data = data.strip()
        return data == ''

    def __init__(self, data) -> None:
        super().__init__(name='split', data=None)


class TextToken(Token):
    @staticmethod
    def test(data: str):
        return True

    def __init__(self, data) -> None:
        super().__init__(name='text', data=data)

    def merge(self, token: Token):
        data = self.data
        data += '\n'
        data += token.data
        return TextToken(data.strip())

    async def compile(self):
        return markdown_to_html(self.data)


class FileToken(Token):
    @staticmethod
    def test(data: str):
        return is_file(data, document_extensions + image_extensions)

    def __init__(self, data) -> None:
        super().__init__(name='file', data=data)
        self.joinable = False

    async def compile(self):
        data = parse_file(self.data)
        url = data['file']
        text = data['caption'] if data['caption'] else url
        return f'<a href="{url}">{text}</a>'


class ImageToken(Token):
    @staticmethod
    def test(data: str):
        return is_image(data)

    def __init__(self, data) -> None:
        super().__init__(name='image', data=data)
        self.joinable = True
        self.build = None

    def merge(self, token: Token):
        merged_token = ImageCollectionToken([self.data, token.data])
        merged_token.build = self.build
        return merged_token

    async def compile(self):
        img = self.parse_data()
        img = await self.build(img)
        alt = img['alt']
        caption = markdown_to_html(img['caption'])
        src = img['src']

        tpl = f'''
            <div class="kazimir__image">
                <figure>
                    <img alt="{alt}" src="{src}">
                    <figcaption>{caption}</figcaption>
                </figure>
            </div>
        '''
        return tpl.format(img).strip()

    def parse_data(self):
        return parse_file(self.data)


class ImageCollectionToken(ImageToken):
    def __init__(self, data) -> None:
        super().__init__(data)
        self.name = 'image_collection'
        self.build = None

    def merge(self, token: Token):
        if isinstance(token.data, list):
            data = token.data
        else:
            data = [token.data]
        merged_token = ImageCollectionToken([*self.data, *data])
        merged_token.build = self.build
        return merged_token

    async def compile(self):
        data = self.parse_data()
        images = []
        for x in data:
            img = await self.build(x)
            images.append(img)

        images = [x['src'] for x in images]
        images = [f'<img src="{x}">' for x in images]
        images = '\n'.join(images)

        return f'''
            <div class="kazimir__image-collection">
                <div class="fotorama"
                     data-width="100%"
                     data-ratio="800/600"
                >
                    {images}
                </div>
            </div>
        '''

    def parse_data(self):
        return [parse_file(x) for x in self.data]


class UrlToken(Token):
    @staticmethod
    def test(data: str):
        return is_url(data)

    def __init__(self, data) -> None:
        super().__init__(name='url', data=data)
        self.joinable = False


def markdown_to_html(text):
    return markdown(text)


def is_url(sample: str):
    link = parse_link(sample)
    if not link:
        return False

    url = link['url']
    return url.scheme and url.netloc


def is_image(sample: str):
    file = parse_file(sample)['file']
    return is_file(file, image_extensions)


def is_document(sample: str):
    file = parse_file(sample)['file']
    return is_file(file, document_extensions)


def is_file(sample: str, extensions):
    name, ext = os.path.splitext(sample)
    ext = ext.lower()
    return ext in extensions


def parse_file(sample: str):
    """
        ![Caption](file.jpg) -> {file, caption}
        file.jpg Caption -> {file, caption}

        :param sample:
        :return:
        """
    p = re.match(r'!\[(.*)\]\((.*)\)', sample)
    if p:
        caption = p.group(1)
        file = p.group(2)
    else:
        sample = sample.split(' ')
        file = sample[0]
        caption = ' '.join(sample[1:])
    return {
        'file': file,
        'caption': caption,
    }


def parse_link(sample: str):
    """
    ![Alt](href) -> {href, alt}

    :param sample:
    :return:
    """
    p = re.match(r'!\[(.*)\]\((.*)\)', sample)
    if not p:
        return None

    url = p.group(2)
    return {
        'url': urlparse(url),
        'alt': p.group(1),
    }
