from markdown import Extension
from markdown.inlinepatterns import Pattern
from markdown.util import etree


class VideoExtension(Extension):
    def add_inline(self, md, name, klass, re):
        pattern = klass(re)
        pattern.md = md
        pattern.ext = self
        md.inlinePatterns.add(name, pattern, "<reference")

    def extendMarkdown(self, md, md_globals):
        youtube = r'([^(]|^)https?://www\.youtube\.com/watch\?\S*v=(?P<youtubeargs>[A-Za-z0-9_&=-]+)\S*'
        self.add_inline(md, 'youtube', Youtube, youtube)


class Youtube(Pattern):
    def handleMatch(self, m):
        url = 'https://www.youtube.com/embed/%s' % m.group('youtubeargs')
        return flex_video(url)


def flex_video(url):
    """
    <div class="kazimir-video">
     <iframe src="http://www.youtube.com/embed/9otNWTHOJi8" frameborder="0" allowfullscreen></iframe>
   </div>
    """
    iframe = etree.Element('iframe')
    iframe.set('src', url)
    iframe.set('frameborder', '0')
    iframe.set('allowfullscreen', '')

    obj = etree.Element('div')
    obj.set('class', "kazimir-video")
    obj.append(iframe)
    return obj
