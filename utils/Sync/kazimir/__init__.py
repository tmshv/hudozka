import lxml.html
from markdown import markdown

from kazimir.figure import FigureExtension
from kazimir.instagram import InstagramExtension
from sync.data import request


def markdown_to_html(text):
    return markdown(text, extensions=[
        FigureExtension(),
        InstagramExtension(),
    ])


def get_images_src(text: str) -> [str]:
    html = markdown(text)
    post_html = lxml.html.fromstring(html)

    images = post_html.cssselect('img')
    return [img.get('src') for img in images]


def kazimir_to_html(text: str) -> str:
    tokens = text.split('\n')
    tokens = markup_tokens(tokens)
    tokens = join_tokens(tokens)
    tokens = merge_tokens(tokens)

    return compile_tokens(tokens)


def html_from_tree(tree):
    html = lxml.html.tostring(tree, encoding='unicode')

    return html


async def typo(text):
    url = 'http://www.typograf.ru/webservice/'
    params = dict(text=text)
    return await request.post(url, params, {'chr': 'utf-8'})


def join_tokens(tokens):
    buffer_tag = None
    buffer = []
    ts = []
    for token in tokens:
        tag = token['tag']
        changed = buffer_tag is not None and tag != buffer_tag

        flush = is_tag_split(tag)
        if changed:
            flush = True

        if not is_tag_joinable(tag):
            flush = True

        if flush:
            if buffer:
                ts.append(buffer)
            if is_tag_split(tag):
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
        tag = ts[0]['tag']
        fn = None
        if tag == 'image':
            fn = merge_image
        elif tag == 'text':
            fn = merge_text
        else:
            fn = merge_any
        tokens_out.append(fn(ts))
    return tokens_out


def compile_tokens(tokens: list):
    compiled = []
    for ts in tokens:
        tag = ts['tag']
        fn = None
        if tag == 'text':
            fn = compile_text
        elif tag == 'image_collection':
            fn = compile_image_collection
        elif tag == 'image':
            fn = compile_image
        elif tag == 'url':
            fn = compile_url
        else:
            fn = compile_any
        compiled.append(fn(ts))
    return '\n'.join(compiled)


def markup_tokens(tokens: list):
    marked_tokens = []
    for token in tokens:
        tag = 'text'
        if is_url(token):
            tag = 'url'
        elif is_image(token):
            tag = 'image'
        elif not token:
            tag = 'split'
            token = None

        marked_tokens.append({
            'tag': tag,
            'data': token,
        })
    return marked_tokens


def is_tag_split(tag):
    return tag == 'split'


def is_tag_joinable(tag: str):
    return tag not in ['url']


def is_url(sample: str):
    from urllib.parse import urlparse
    url = urlparse(sample)

    return url.scheme and url.netloc


def is_image(sample: str):
    return sample[:2] == '![' and sample[-1:] == ')'


def merge_any(tokens):
    return tokens[0]


def merge_text(tokens):
    data = ''

    for t in tokens:
        data += t['data']
        data += '\n'

    return {
        'tag': 'text',
        'data': data.strip(),
    }


def merge_image(tokens):
    if len(tokens) == 1:
        return tokens[0]
    else:
        data = [t['data'] for t in tokens]
        return {
            'tag': 'image_collection',
            'data': data,
        }


def compile_text(token):
    return markdown_to_html(token['data'])


def compile_image_collection(token):
    file = lambda i: i[4:][:-1]
    imgs = ['<img src="{}">'.format(file(i)) for i in token['data']]
    return '''
        <div class="kazimir__image-collection">
            <div class="fotorama"
                 data-width="100%"
                 data-ratio="800/600"
            >
                {}
            </div>
        </div>
    '''.format('\n'.join(imgs))


def compile_image(token):
    img = markdown_to_html(token['data'])
    tpl = '''<div class="kazimir__image">{}</div>'''
    return tpl.format(img)


def compile_url(token):
    return compile_youtube(token)


def compile_youtube(token):
    """
    <div class="kazimir-video">
     <iframe src="http://www.youtube.com/embed/9otNWTHOJi8" frameborder="0" allowfullscreen></iframe>
   </div>
    """

    url = token['data']
    tpl = '''<div class="kazimir-video"><iframe src="{url}" frameborder="0" allowfullscreen></iframe></div>'''

    return tpl.format(url=url)


def compile_any(token):
    return markdown_to_html(token['data'])


if __name__ == '__main__':
    sample_text = '''
Hello!

https://www.instagram.com/p/BUelE04l1kU
ku!

https://www.instagram.com/p/BUrOXoBFayG/?taken-by=hudozka
https://www.youtube.com/watch?v=qnguOqWpraI
![](1.jpg)
![](2.jpg)
![](3.jpg)

LOL NOOB
![](12.jpg)
![](22.jpg)
WTF OMG

Bye!
Fye!

![](1.jpg)

More text
    '''

    ts = make(sample_text)
    if isinstance(ts, list):
        for i in ts:
            print(i)
    else:
        print(ts)
