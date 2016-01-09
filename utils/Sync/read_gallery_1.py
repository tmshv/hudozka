from datetime import datetime
import re
import lxml.html
from markdown import markdown
import time
from Album import Album
import lxml_utils
import settings

__author__ = 'Roman Timashev'

artist_name_exp = re.compile('([ %s]+)(\s\(\d+ лет\))?$' % (settings.CYR_LOWER+settings.CYR_UPPER))
# artist_name_exp = re.compile('(.+)(\s\(\d+ лет\))?$')
artist_age_exp = re.compile('.+\((\d+) лет\)$')

class GalleryReader:
    def __init__(self, path):
        super().__init__()
        self.html = None
        self.description_path = path

    def read(self):
        with open(self.description_path, 'r', encoding='utf-8') as dfile:
            data = dfile.read()
            md = markdown(data)
            self.html = lxml.html.fromstring(md)

            # ALBUM
            try:
                album_title = self.html.xpath('.//h1/a/text()')[0]
                album_uri = self.html.xpath('.//h1/a/@href')[0]
            except:
                raise Exception('Cannot read album title/uri')

            # COURSE
            try:
                course_title = self.html.xpath('.//p/a/text()')[0]
                course_uri = self.html.xpath('.//p/a/@href')[0]
            except:
                raise Exception('Cannot read course title/uri')

            # TEACHER
            teacher = lxml_utils.get_text_following_by_tag(self.html, 'em', "Преподаватель")
            teacher = re.sub(r'\s', '', teacher)
            if teacher not in settings.teachers_names:
                raise Exception('Teacher %s is not found' % teacher)
            teacher_name = settings.teachers_names[teacher]

            # DATE
            date = self.get_date()
            if date is None:
                raise Exception('Date field is empty')

            # PRODUCT
            content = self.get_drawings()

            a = Album(type='1', title=album_title, uri=album_uri, course=course_title, course_uri=course_uri, date=date, teacher=teacher_name, comment=None)
            for p in content:
                a.add_product(p)
            return a

    def get_drawings(self):
        drawings = []
        h3_list = self.html.xpath('.//h3')
        for h3 in h3_list:
            artist_name_age = h3.xpath('./a')
            if len(artist_name_age) == 0:
                raise Exception('Artist name should be a link')
            artist_name_age = artist_name_age[0].text

            # ARTIST NAME [required]
            if artist_name_age is None:
                raise Exception('Artist name section is empty')

            exp = artist_name_exp.search(artist_name_age)
            if exp is None:
                raise Exception('Artist name is not specified')
            artist_name = exp.group(1).strip()

            # ARTIST AGE [optional]
            exp = artist_age_exp.search(artist_name_age)
            if exp is not None and len(exp.groups()) > 0:
                artist_age = int(exp.group(1))
            else:
                artist_age = None

            image_filename = h3.xpath('./a/@href')[0]

            # PRODUCT TITLE [optional]
            drawing_data = lxml_utils.get_following_tags(h3, 'h3')
            if len(drawing_data) == 0:
                product_title = None
                # raise Exception('Product title not specified')
            else:
                product_title = drawing_data[0].text[1:-1]

            drawings.append((artist_name, artist_age, image_filename, product_title))

        return drawings

    def get_date(self):
        string = lxml_utils.get_text_following_by_tag(self.html, 'em', "Дата")
        if string is None:
            return None

        for f in settings.date_formats:
            try:
                date = time.strptime(string, f)
                return datetime.fromtimestamp(time.mktime(date))
            except ValueError:
                continue
        return None
