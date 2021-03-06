import lxml.html
from markdown import markdown

from kazimir.Token import SplitToken


class Marker:
    def __init__(self) -> None:
        super().__init__()
        self.tokens = []

    def add_token_factory(self, token):
        self.tokens.append(token)

    def parse(self, text: str):
        tokens = text.split('\n')
        tokens = self.markup_tokens(tokens)
        tokens = join_tokens(tokens)
        tokens = merge_tokens(tokens)

        return tokens

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
