import asyncio

from kazimir.DocumentUrlToken import DocumentUrlToken
from kazimir.DocumentToken import DocumentToken
from kazimir.CSVToken import CSVToken
from kazimir.InstagramToken import InstagramToken
from kazimir.Marker import Marker, html_from_tree
from kazimir.YoutubeToken import YoutubeToken
from kazimir.Token import SplitToken, ImageToken, UrlToken, FileToken, TextToken, TokenFactory, \
    BuildTokenFactory
from sync import Document

if __name__ == '__main__':
    sample_text = '''
Hello!

https://www.instagram1.com/p/BUelE04l1kU

https://www.youtube.com/watch?v=qnguOqWpraI
https://www.youtube.com/watch?v=qnguOqWpraI
![](1.jpg)
![](2.jpg)

LOL NOOB
![](12.jpg)
![](22.jpg)
WTF OMG

![](/document/documents-arkhiv-ustav-2013-pdf)

![File](file.pdf)
hello.pdf
file.doc
sheet.xlsx

print.docx
image.jpg 1
image.png 2

image.jpeg Hi

Bye!
Fye!

![](1.jpg)

["Ya"](http://ya.ru)

More text

file.csv
    '''


    async def build_document(data):
        text = data['caption'] if data['caption'] else data['file']
        # document = await self.build()
        document = {
            'url': data['file'],
            'image_url': data['file'],
            'file_url': data['file'],
            'title': text,
            'file_size': '0 KB',
            'file_format': 'PDF',
        }
        return document

    async def read_csv(data):
        return '\n'.join([
            'N,Name',
            f'0,{data}',
            '1,Pop',
            '2,Top',
        ])

    async def read_document(data):
        doc = await Document.find_one({'id': data})
        return {
            'url': doc['url'],
            'image_url': doc['url'],
            'file_url': doc['url'],
            'title': doc['title'],
            'file_size': '0 KB',
            'file_format': 'PDF',
        }


    async def run():
        from kazimir.fix_links_quotes import fix_links_quotes

        m = Marker()
        m.add_token_factory(TokenFactory(SplitToken))
        m.add_token_factory(TokenFactory(YoutubeToken))
        m.add_token_factory(TokenFactory(InstagramToken))
        m.add_token_factory(BuildTokenFactory(DocumentUrlToken, build=read_document))
        m.add_token_factory(TokenFactory(UrlToken))
        # m.add_token_factory(TokenFactory(ImageToken))
        m.add_token_factory(BuildTokenFactory(DocumentToken, build=build_document))
        m.add_token_factory(BuildTokenFactory(CSVToken, build=read_csv))
        m.add_token_factory(TokenFactory(FileToken))
        m.add_token_factory(TokenFactory(TextToken))
        m.add_tree_middleware(fix_links_quotes)
        sample_tree = await m.create_tree(sample_text)

        # for x in sample_tree:
        #     print(x)

        print(html_from_tree(sample_tree))


    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.close()
