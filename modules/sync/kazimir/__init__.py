import lxml.html
import re
from markdown import markdown

from kazimir.figure import FigureExtension
from kazimir.instagram import InstagramExtension
from sync.data import request

def extract_files(text: str) -> [str]:
    html = markdown(text)
    post_html = lxml.html.fromstring(html)

    images = post_html.cssselect('img')
    images = [img.get('src') for img in images]

    return images, []


def html_from_tree(tree):
    html = lxml.html.tostring(tree, encoding='unicode')

    return html


async def typo(text):
    from kazimir import artlebedev
    result = await artlebedev.typograf(text)
    if result == 'Размер текста ограничен 32 КБ':
        return text

    return result
    # url = 'http://www.typograf.ru/webservice/'
    # params = dict(text=text)
    # return await request.post(url, params, {'chr': 'utf-8'})
