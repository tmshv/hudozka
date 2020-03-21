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

    async def get_data(self):
        return self.data

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


class HtmlToken(Token):
    @staticmethod
    def test(data: str):
        """
        Result of compiling markdown to html is the same as source data meaning that the source is html
        """
        html = markdown(data)
        return html == data

    def __init__(self, data: str) -> None:
        super().__init__(name='html', data=data)
        self.joinable = False


class FileToken(Token):
    @staticmethod
    def test(data: str):
        return is_file(data, document_extensions + image_extensions)

    def __init__(self, data) -> None:
        super().__init__(name='file', data=data)
        self.joinable = False

    async def get_data(self):
        return parse_file(self.data)


class ImageToken(Token):
    @staticmethod
    def test(data: str):
        return is_image(data)

    def __init__(self, data) -> None:
        super().__init__(name='image', data=data)
        self.joinable = False
        self.build = None

    async def get_data(self):
        data = parse_file(self.data)
        data = await self.build(data)
        return data


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
    url = urlparse(sample)
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
