import html

from feedgen.feed import FeedGenerator

from db import collection


def get_items(collection_name, query={}):
    return list(
        collection(collection_name).find(query)
    )


def get_feed():
    events = get_items('events')
    news = get_items('timeline', {'type': 'post'})

    articles = sorted(events + news, key=lambda item: item['date'], reverse=True)

    fg = FeedGenerator()
    fg.id('art.shlisselburg.org')
    fg.title('Шлиссельбургская ДХШ')
    fg.link(href='https://art.shlisselburg.org', rel='alternate')
    fg.logo('https://static.shlisselburg.org/art/graphics/favicon-144.png')
    fg.link(href='https://art.shlisselburg.org/feed', rel='self')
    fg.language('ru')

    for article in articles:
        content = html.unescape(article['post'])
        article_id = article['id']
        url = 'https://art.shlisselburg.org/article/{id}'.format(id=article_id)

        fe = fg.add_entry()
        fe.id(article_id)
        fe.title(article['title'])
        fe.content(content, None, 'CDATA')
        fe.link({'href': url})

    return fg.atom_str(pretty=True)