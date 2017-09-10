import lxml.html
import requests
from markdown import markdown

from kazimir.video import VideoExtension
from kazimir.instagram import InstagramExtension


def markdown_to_html(text):
    return markdown(text, extensions=[
        VideoExtension(),
        InstagramExtension(),
    ])


def kazimir_to_html(text):
    html = make(text)
    return typo(html)


def html_from_tree(tree):
    html = lxml.html.tostring(tree, encoding='unicode')
    html = typo(html)

    return html


def typo(html):
    url = 'http://api.tmshv.com/typograph/v1'
    res = requests.post(
        url=url,
        headers={
            'Content-Type': 'text/plain; charset=utf-8',
        },
        data=html.encode('utf-8')
    )
    if res.status_code == 200:
        return res.text
    return html


def make(text):
    tokens = text.split('\n')
    tokens = markup_tokens(tokens)
    tokens = join_tokens(tokens)
    tokens = merge_tokens(tokens)

    return compile_tokens(tokens)
    # return tokens


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
    return '''
        <div class="kazimir__image">
            {}
        </div>
    '''.format(img)


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

