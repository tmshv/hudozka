import lxml.html
import re
from markdown import markdown

from kazimir.figure import FigureExtension
from kazimir.instagram import InstagramExtension
from sync.data import request

quote_pairs = [
    ('"', '"'),
    ('«', '»'),
]


def markdown_to_html(text):
    return markdown(text, extensions=[
        FigureExtension(),
        InstagramExtension(),
    ])


def extract_files(text: str) -> [str]:
    html = markdown(text)
    post_html = lxml.html.fromstring(html)

    images = post_html.cssselect('img')
    images = [img.get('src') for img in images]

    return images, []


def create_tree(text: str) -> str:
    tokens = text.split('\n')
    tokens = markup_tokens(tokens)
    tokens = join_tokens(tokens)
    tokens = merge_tokens(tokens)

    kz = compile_tokens(tokens)
    tree = lxml.html.fromstring(kz)
    return clean_tree(tree)


def clean_tree(tree):
    return fix_links_quotes(tree)


def fix_links_quotes(tree):
    safe = lambda x: x if x else ''

    for link in tree.iterlinks():
        a = link[0]
        if a.tag != 'a':
            continue

        quote = get_quote_pair(a.text)
        if not quote:
            continue

        # New text of A without quotes
        a.text = a.text[1:-1]

        # Move first quote out of A to the prefix
        a.getparent().text = safe(a.getparent().text) + quote[0]

        # Move last quote out of A to the suffix
        a.tail = quote[1] + safe(a.tail)

    return tree


def get_quote_pair(text: str):
    """
    sample text -> [s]ample tex[t] -> (s, t) -> match pair from quote_pair
        ? (s, t)
        : None

    :param text:
    :return:
    """
    if len(text) < 2:
        return None

    first = text[0]
    last = text[-1]

    for pair_first, pair_last in quote_pairs:
        if pair_first == first and pair_last == last:
            return first, last

    return None


def html_from_tree(tree):
    html = lxml.html.tostring(tree, encoding='unicode')

    return html


async def typo(text):
    from kazimir import artlebedev
    return await artlebedev.typograf(text)
    # url = 'http://www.typograf.ru/webservice/'
    # params = dict(text=text)
    # return await request.post(url, params, {'chr': 'utf-8'})


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
    <div class="kazimir__video">
     <iframe src="http://www.youtube.com/embed/9otNWTHOJi8" frameborder="0" allowfullscreen></iframe>
   </div>
    """

    youtube = r'([^(]|^)https?://www\.youtube\.com/watch\?\S*v=(?P<youtubeargs>[A-Za-z0-9_&=-]+)\S*'
    youtube_pattr = re.compile(youtube)
    match = youtube_pattr.match(token['data'])
    if match:
        video_id = match.group(2)
        url = f'//www.youtube.com/embed/{video_id}'
        tpl = '''<div class="kazimir__video"><iframe src="{url}" frameborder="0" allowfullscreen></iframe></div>'''

        return tpl.format(url=url)
    else:
        return ''


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

    sample_tree = create_tree(sample_text)
    print(html_from_tree(sample_tree))
