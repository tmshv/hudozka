import asyncio
import lxml.html
from markdown import markdown
from kazimir.InstagramToken import InstagramToken
from kazimir.YoutubeToken import YoutubeToken
from kazimir.Token import SplitToken, ImageToken, UrlToken, FileToken, TextToken, DocumentToken, TokenFactory, \
    BuildTokenFactory


class Marker:
    def __init__(self) -> None:
        super().__init__()
        self.tokens = []
        self.tree_middlewares = []

    def add_token_factory(self, token):
        self.tokens.append(token)

    def add_tree_middleware(self, callback):
        self.tree_middlewares.append(callback)

    async def create_tree(self, text: str):
        tokens = text.split('\n')
        tokens = self.markup_tokens(tokens)
        tokens = join_tokens(tokens)
        tokens = merge_tokens(tokens)

        compiled = await compile_tokens(tokens)
        tree = lxml.html.fromstring(compiled)
        return await self.process_tree(tree)

    async def process_tree(self, tree):
        for fn in self.tree_middlewares:
            tree = await fn(tree)
        return tree

    def markup_tokens(self, tokens: list):
        marked_tokens = []

        for data in tokens:
            t = self.create_token(data)
            if t:
                marked_tokens.append(t)
            else:
                raise Exception(f'Token not recognized for data {data}')
        return marked_tokens

    def create_token(self, data):
        for f in self.tokens:
            if f.token.test(data):
                return f.create(data=data)
        return None


def join_tokens(tokens):
    is_split = lambda x: isinstance(x, SplitToken)

    buffer_tag = None
    buffer = []
    ts = []
    for token in tokens:
        tag = token.name
        changed = buffer_tag is not None and tag != buffer_tag

        flush = is_split(token)
        if changed:
            flush = True

        if not token.joinable:
            flush = True

        if flush:
            if buffer:
                ts.append(buffer)
            if is_split(token):
                buffer = []
                buffer_tag = None
            else:
                buffer = [token]
                buffer_tag = tag
        else:
            buffer_tag = tag
            buffer.append(token)

    if len(buffer):
        ts.append(buffer)
    return ts


def merge_tokens(tokens: list):
    tokens_out = []
    for ts in tokens:
        token = ts[0]
        for x in ts[1:]:
            token = token.merge(x)
        tokens_out.append(token)
    return tokens_out


async def compile_tokens(tokens: list):
    result = []
    for token in tokens:
        data = await token.compile()
        result.append(data)
    return '\n'.join(result)


def extract_files(text: str) -> [str]:
    html = markdown(text)
    post_html = lxml.html.fromstring(html)

    images = post_html.cssselect('img')
    images = [img.get('src') for img in images]

    return images, []


def html_from_tree(tree):
    html = lxml.html.tostring(tree, encoding='unicode')

    return html


if __name__ == '__main__':
    sample_text = '''
Hello!

https://www.instagram1.com/p/BUelE04l1kU

https://www.youtube.com/watch?v=qnguOqWpraI
https://www.youtube.com/watch?v=qnguOqWpraI
![](1.jpg)
![](2.jpg)

LOL NOOB
![](12.jpg)
![](22.jpg)
WTF OMG

![File](file.pdf)
hello.pdf
file.doc
sheet.xlsx

print.docx
image.jpg 1
image.png 2

image.jpeg Hi

Bye!
Fye!

![](1.jpg)

["Ya"](http://ya.ru)

More text
    '''


    async def build_document(data):
        text = data['caption'] if data['caption'] else data['file']
        # document = await self.build()
        document = {
            'url': data['file'],
            'image_url': data['file'],
            'file_url': data['file'],
            'title': text,
            'file_size': '0 KB',
            'file_format': 'PDF',
        }
        return document


    async def run():
        from kazimir.fix_links_quotes import fix_links_quotes

        m = Marker()
        m.add_token_factory(TokenFactory(SplitToken))
        m.add_token_factory(TokenFactory(YoutubeToken))
        m.add_token_factory(TokenFactory(InstagramToken))
        m.add_token_factory(TokenFactory(UrlToken))
        m.add_token_factory(TokenFactory(ImageToken))
        m.add_token_factory(BuildTokenFactory(build=build_document))
        m.add_token_factory(TokenFactory(FileToken))
        m.add_token_factory(TokenFactory(TextToken))
        m.add_tree_middleware(fix_links_quotes)
        sample_tree = await m.create_tree(sample_text)

        # for x in sample_tree:
        #     print(x)

        print(html_from_tree(sample_tree))


    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.close()
