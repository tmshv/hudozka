from flask import Flask

from feed import get_feed

app = Flask(__name__)


@app.route('/')
def root():
    feed = get_feed()
    if not feed:
        return '', 404

    return feed
