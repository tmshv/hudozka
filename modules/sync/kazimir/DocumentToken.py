from kazimir.Token import parse_file, is_document, Token


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
