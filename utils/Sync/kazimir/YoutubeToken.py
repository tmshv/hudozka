import re
from urllib.parse import urlparse
from kazimir.Token import UrlToken, is_url

pattr = re.compile(r'([^(]|^)https?://www\.youtube\.com/watch\?\S*v=(?P<youtubeargs>[A-Za-z0-9_&=-]+)\S*')


class YoutubeToken(UrlToken):
    @staticmethod
    def test(data: str):
        if not is_url(data):
            return False

        url = urlparse(data)
        return url.netloc in ['www.youtube.com', 'youtube.com']

    async def compile(self):
        """
        <div class="kazimir__video">
            <iframe src="http://www.youtube.com/embed/9otNWTHOJi8" frameborder="0" allowfullscreen></iframe>
        </div>
        """

        match = pattr.match(self.data)
        if match:
            video_id = match.group(2)
            url = f'//www.youtube.com/embed/{video_id}'
            return f'''
                <div class="kazimir__video"><iframe src="{url}" frameborder="0" allowfullscreen></iframe></div>
            '''.strip()
        else:
            return ''
