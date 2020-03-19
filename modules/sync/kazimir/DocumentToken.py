from kazimir.Token import parse_file, is_document, Token
import math


class DocumentToken(Token):
    @staticmethod
    def test(data: str):
        return is_document(data)

    def __init__(self, data) -> None:
        super().__init__(name='file', data=data)
        self.joinable = False
        self.build = None

    async def get_data(self):
        data = parse_file(self.data)
        document = await self.build(data)
        return document

    async def compile(self):
        document = await self.get_data()

        return create_document(document)


def create_document(document):
    file_size = get_size(document['file_size'], 1)
    file_format = 'ПДФ'

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
                    {file_format} ({file_size})
                </a>
            </div>
        </div>
    </div>
    '''.strip()


def get_size(number_of_bytes, precision=1):
    units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ']
    number = math.floor(math.log(number_of_bytes) / math.log(1024))
    size = (number_of_bytes / math.pow(1024, math.floor(number)))
    size = round(size, precision)

    return f'{size} {units[number]}'
