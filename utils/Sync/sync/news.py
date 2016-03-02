import os
from glob import glob

from db import db
from sync import create_date
from utils.fn import lmap, lprint_json
from utils.io import read_yaml_md
from utils.text.transform import url_encode_text


def sync_news(record):
    if isinstance(record, list):
        return lmap(
            sync_news,
            record
        )

    q = {'id': record['id']}
    try:
        collection = db().timeline
        update_result = collection.update_one(q, {'$set': record}, upsert=True)
        i = collection.find_one({'id': record['id']})
        return i
    except ValueError:
        pass

    return None


def create_news(profile):
    formats = [
        '%d.%m.%Y',
        '%d.%m.%Y %H:%M',
        '%d.%m.%Y %H:%M:%S'
    ]

    if 'title' not in profile:
        return None

    if 'date' in profile:
        profile['date'] = create_date(profile['date'], formats)

    if 'until' in profile:
        profile['until'] = create_date(profile['until'], formats)

    if 'id' not in profile:
        id = lambda date, title: '{date}-{title}'.format(
            date=date.strftime('%Y-%m-%d'),
            title=url_encode_text(title)
        )
        profile['id'] = id(profile['date'], profile['title'])

    return profile


if __name__ == '__main__':
    news_dir = '/Users/tmshv/Dropbox/Dev/Hud school/News'
    os.chdir(news_dir)

    # GET NEWS FILES
    file_glob = os.path.join(news_dir, '*.md')
    news = glob(file_glob)

    # READ MANIFEST FILES -> NEWS_MANIFEST
    news = lmap(
        lambda i: (os.path.basename(i),) + read_yaml_md(i),
        news
    )
    news = lmap(
        lambda i: {
            **i[1],
            'file': i[0],
            'message': i[2]
        },
        news
    )

    # NEWS_MANIFEST -> NEWS_OBJECT
    news = lmap(
        create_news,
        news
    )

    # FILTER BROKEN NEWS_OBJECT
    news = list(filter(
        None,
        news
    ))

    # SYNC EVENT_OBJECT WITH DB
    events = lmap(
        sync_news,
        news
    )

    lprint_json(news)
    print('SYNC NEWS DONE')
