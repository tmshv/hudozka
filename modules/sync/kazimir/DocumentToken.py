from kazimir.Token import parse_file, is_document, Token


class DocumentToken(Token):
    @staticmethod
    def test(data: str):
        return is_document(data)

    def __init__(self, data) -> None:
        super().__init__(name='file', data=data)
        self.joinable = False
        self.build = None

    async def compile(self):
        data = parse_file(self.data)
        document = await self.build(data)

        return create_document(document)


def create_document(document):
    return f'''
    <div>
        <div class="document-row">
            <a href="{document['url']}" class="invisible">
                <div class="document-row__image">
                    <img src="{document['image_url']}" alt="{document['title']}">
                </div>
            </a>

            <div class="document-row__file">
                <a href="{document['url']}">{document['title']}</a>
            </div>

            <div class="document-row__file-info">
                <a href="{document['file_url']}" target="_blank">
                    {document['file_format']} ({document['file_size']})
                </a>
            </div>
        </div>
    </div>
    '''.strip()
