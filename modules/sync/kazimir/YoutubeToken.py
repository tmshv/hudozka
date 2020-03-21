from urllib.parse import urlparse, parse_qs
from kazimir.Token import UrlToken, is_url


class YoutubeToken(UrlToken):
    @staticmethod
    def test(data: str):
        if not is_url(data):
            return False

        url = urlparse(data)
        return url.netloc in ['www.youtube.com', 'youtube.com']

    def __init__(self, data: str) -> None:
        super().__init__(data=data)
        self.name = 'youtube'

    async def get_data(self):
        return {
            'url': self.data
        }
