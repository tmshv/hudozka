from glob import glob
import os
import markdown as md
import lxml.html as html
from lxml.etree import tostring
import re
import pymongo
import requests
import img
import lxml_utils

__author__ = 'tmshv'

# db = pymongo.MongoClient('mongodb://localhost:27017')['stickers']

# images_dir = os.path.expanduser('~/Dropbox/Dev/Hud school/Static/images')
catalog_dir = os.path.expanduser('~/Dropbox/Dev/Hud school/Hudozka/Gallery')
catalog_files = os.listdir(catalog_dir)


def lesson_info(page):
    lesson = list(filter(lambda h2: not h2.xpath('./a'), page.xpath('//h2')))[0]
    content = lxml_utils.get_following_tags(lesson, 'h2')
    for p in lxml_utils.get_following_tags(lesson, 'h2'):
        print(p, tostring(p, encoding='utf-8').decode())

    # print(content[0].xpath('./em/text()')[0].strip())
    # print(content[0].xpath('./text()')[0].strip())

    # print(content[1].xpath('./text()'))
    # return content

    date_str = '12.10.2013'

    #todo: make as `date`
    date = date_str

    return {
        'name': 'Collage',
        'course': 'painting',
        'technology': ['pastel', 'huel', 'glue'],
        'date': date,
    }


def drawings_info(page):
    out = []
    pics = list(filter(lambda h2: h2.xpath('./a'), page.xpath('//h2')))
    for p in pics:
        content = lxml_utils.get_following_tags(p, 'h2')[0]
        author_info = content.xpath('./text()')[0].split('\n')
        out.append({
            'name': p.xpath('./a/text()')[0],
            'image': p.xpath('./a/@href')[0],
            'author': author_info[0],
            'author_age': int(author_info[1].split(' ')[0])
        })
    return out


def generate_image_filename(src, course, year, theme, author, size, i,ext):
    if ext is None:
        ext = os.path.splitext(src)[1]

    if i == 0:
        filename = '{course}-{year}-{theme}-{author}-{size}.{ext}'
    else:
        filename = '{course}-{year}-{theme}-{author}-{index}-{size}.{ext}'\

    filename = filename.format(
        course=course,
        year=year,
        theme=theme,
        author=author,
        size=size,
        index=i,
        ext=ext
    )
    return filename


for cf in catalog_files:
    os.chdir(catalog_dir)
    if os.path.isdir(cf):
        print('======================================================================================')
        print(cf)

        product_dir = os.path.join(catalog_dir, cf)
        os.chdir(product_dir)

        def matching_files(param):
            if isinstance(param, list):
                return list(map(matching_files, param))
            else:
                return glob(param)


        product_file = matching_files('*.md')[0]

        def from_file(path):
            f = open(path, 'r')
            data = f.read()
            f.close()
            return data

        markdown_text = from_file(product_file)
        html_text = md.markdown(markdown_text)
        page = html.fromstring(html_text)
        print(html_text)

        # name
        name = page.xpath('//h1/text()')[0]

        # lesson
        # filtering paragraph with no link in h2 title
        lesson = lesson_info(page)
        print(lesson)

        drawings = drawings_info(page)
        for d in drawings:
            print(d)

        products = list(map(
            lambda drawing: {
                'image': drawing['image'],
                'name': drawing['name'],
                'author': drawing['author'],
                'authorAge': drawing['author_age'],
                'course': lesson['course'],
                'theme': lesson['name'],
                'rating': 10,
                'date': lesson['date']
            },
            drawings
        ))

        for p in products:
            print(p)

            # # price
            # def str_price_to_int(text):
            # items = text.split('\n')
            # out = list(map(lambda p: int(re.sub('[^\d]+', '', p)), items))
            # return out
            #
            #
            # price_text = page.xpath('//h2[contains(text(), "Цена")]/following-sibling::p/text()')[0]
            # product_price = str_price_to_int(price_text)
            #
            # # colors
            # def str_colors_to_code_list(text):
            #     cl = re.split('\s+', text)
            #     return ttcolor.color_by_code(cl)
            #
            # color_text = page.xpath('//h2[contains(text(), "Цвета")]/following-sibling::p/text()')[0]
            # product_colors = str_colors_to_code_list(color_text)
            #
            # # text
            # def format_text(text):
            #     try:
            #         res = requests.post("http://mdash.ru/api.v1.php", {
            #             'text': text
            #         })
            #         return res.json()['result']
            #
            #     except Exception as e:
            #
            #         return text
            #
            # product_text = page.xpath('//h2[contains(text(), "Текст")]/following-sibling::p/text()')[0]
            # # product_text = format_text(product_text)
            #
            #
            # # qualities
            # def get_quality(li):
            #     q = {
            #         'image': li.xpath('./img/@src')[0],
            #         'text': li.xpath('text()')[0].strip()
            #     }
            #     return q
            #
            #
            # def qualities_list(elements):
            #     return list(map(get_quality, elements))
            #
            #
            # qualities_elements = page.xpath('//h2[contains(text(), "Свойства")]/following-sibling::ul/li')
            # qualities = qualities_list(qualities_elements)
            #
            #

            product_images = [p['image']]

            image_sizes = [
                (50, 50, 'small'),
                (300, 300, 'preview'),
                (800, 800, 'medium'),
                (2000, 2000, 'big'),
                (0, 0, 'original')
            ]

            images = []
            i = 0
            for image in product_images:
                pi = {'source': image}

                for size in image_sizes:
                    size_name = size[2]
                    image_filename = generate_image_filename(image, size_name, product_sku, i, 'png')
                    d = os.path.join(images_dir, image_filename)
                    pi[size_name] = 'http://static.touchtwin.ru/images/{img}'.format(img=image_filename)
                    if size_name == 'original':
                        img.optimize(image, d, quality=90)
                    else:
                        img.minify(image, d, size[:2])

                images.append(pi)
                i += 1

            p['images'] = images
            del p['image']

            # db['products'].update({'uri': product_uri}, p, upsert=True)