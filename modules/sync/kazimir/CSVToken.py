import csv
import io

from kazimir.Token import FileToken, is_file

extensions = ['.csv']


class CSVToken(FileToken):
    @staticmethod
    def test(data: str):
        return is_file(data, extensions)

    def __init__(self, data) -> None:
        super().__init__(data=data)
        self.name = 'csv'
        self.joinable = False
        self.build = None

    async def compile(self):
        data = await self.build(self.data)

        f = io.StringIO(data)
        reader = csv.reader(f, delimiter=',', quotechar='|')

        headers = next(reader, None)

        row = lambda xs: '\n'.join([
            f'<td>{x}</td>' for x in xs
        ])

        head = '\n'.join([
            f'<th>{x}</th>' for x in headers
        ])
        body = '\n'.join([
            f'<tr>{row(x)}</tr>' for x in reader
        ])

        return f'''
            <table class="MarkerTable">
                <thead><tr>
                    {head}
                </tr></thead>
                <tbody>{body}</tbody>
            </table>
        '''.strip()
