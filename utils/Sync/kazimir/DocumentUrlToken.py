from kazimir.Token import UrlToken, parse_link


class DocumentUrlToken(UrlToken):
    @staticmethod
    def test(data: str):
        link = parse_link(data)
        if not link:
            return False
        url = link['url']
        host = url.netloc
        path = url.path
        return path.startswith('/document/') and (host == '' or host == 'art.shlisselburg.org')

    def __init__(self, data) -> None:
        super().__init__(data)
        self.build = None

    async def compile(self):
        from kazimir.DocumentToken import create_document

        link = parse_link(self.data)
        url = link['url']
        doc_id = url.path.replace('/document/', '')
        doc = await self.build(doc_id)

        if not doc:
            raise Exception(f'Document {doc_id} not found')

        # return f'''DOCUMENT: {# doc['title']}'''
        return create_document(doc)

    def merge(self, token):
        return self

    def __repr__(self) -> str:
        return f'[Token {self.name} {self.data}]'
