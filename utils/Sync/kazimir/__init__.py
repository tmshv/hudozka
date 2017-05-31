import lxml.html
import requests
from markdown import markdown

from kazimir.video import VideoExtension


def markdown_to_html(text):
    return markdown(text, extensions=[VideoExtension()])


def kazimir_to_html(text):
    html = markdown_to_html(text)
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
