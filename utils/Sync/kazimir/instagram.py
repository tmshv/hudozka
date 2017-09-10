import requests
from markdown import Extension
from markdown.inlinepatterns import Pattern
from markdown.util import etree


class InstagramExtension(Extension):
    def add_inline(self, md, name, klass, re):
        pattern = klass(re)
        pattern.md = md
        pattern.ext = self
        md.inlinePatterns.add(name, pattern, "<reference")

    def extendMarkdown(self, md, md_globals):
        match_url = r'https?://www\.instagram\.com/p/(?P<media>[\w\d]+)/?(.*)$'
        self.add_inline(md, 'instagram', Instagram, match_url)


class Instagram(Pattern):
    def handleMatch(self, m):
        return embed_instagram(m.group('media'))


def embed_instagram(media):
    """
    <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
        <div style="padding:8px;">
            <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:35.0% 0; text-align:center; width:100%;">
                <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;">
                </div>
            </div>

            <p style=" margin:8px 0 0 0; padding:0 4px;">
                <a href="https://www.instagram.com/p/BUelE04l1kU/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">
                    Композиция. Второй год обучения. Преподаватель Гоголева О.Д. #shlb_hudozka #живопись #дети #детирисуют #гуашь #пословицыипоговорки #художка #шлиссельбург #shlisselburg
                </a>
            </p>

            <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">
                A post shared by Шлиссельбургская ДХШ (@hudozka) on

                <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2017-05-24T14:05:19+00:00">
                    May 24, 2017 at 7:05am PDT
                </time>
            </p>
        </div>
    </blockquote>
    """

    url = 'https://api.instagram.com/oembed?url=http://instagr.am/p/{}&hidecaption=true&omitscript=true'.format(media)
    req = requests.get(url)
    if req.status_code == 200:
        html = req.json()['html']
        html = fix_html(html)
        i = etree.fromstring(html)

        obj = etree.Element('div')
        obj.set('class', "kazimir__embed")
        obj.append(i)
        return obj
    else:
        raise Exception(
            'Failed to compile Instagram {media}: Status Code: {status}'.format(media=media, status=req.status_code)
        )


def fix_html(html: str):
    return html.replace('data-instgrm-captioned', 'data-instgrm-captioned=""')
