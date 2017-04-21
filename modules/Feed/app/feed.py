import html

from feedgen.feed import FeedGenerator

from db import collection


def get_feed():
    events = list(collection('events').find({}))
    news = list(collection('timeline').find({'type': 'post'}))

    articles = events + news

    fg = FeedGenerator()
    fg.id('1')
    fg.title('Шлиссельбургская ДХШ')
    # fg.author({'name': 'John Doe', 'email': 'john@example.de'})
    fg.link(href='https://art.shlisselburg.org', rel='alternate')
    # fg.logo('http://ex.com/logo.jpg')
    # fg.subtitle('События ')
    fg.link(href='https://art.shlisselburg.org/feed', rel='self')
    fg.language('en')

    for article in articles:
        content = html.unescape(article['post'])
        article_id = article['id']
        url = 'https://art.shlisselburg.org/article/{id}'.format(id=article_id)

        fe = fg.add_entry()
        fe.id(article_id)
        fe.title(article['title'])
        fe.content(content, None, 'CDATA')
        fe.link({'href': url})

    # return articles
    return fg.atom_str(pretty=True)
    # return fg.atom_str()
