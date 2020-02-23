from urllib.parse import urlparse, parse_qs
from kazimir.Token import UrlToken, is_url


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

        url = urlparse(self.data)
        query = parse_qs(url.query)

        if 'v' not in query:
            return ''

        video_id = query['v'][0]

        url = f'//www.youtube.com/embed/{video_id}'
        return f'''
            <div class="kazimir__video"><iframe src="{url}" frameborder="0" allowfullscreen></iframe></div>
        '''.strip()
