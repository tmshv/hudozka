# Feed

Link to feed: [art.shlisselburg.org/feed](https://art.shlisselburg.org/feed)

## How to deploy with Docker

```bash
docker build -t hudozka/feed .
docker run -d --name hudozka-feed -p 18050:5000 -e DB_USER="<DB_USER>" -e DB_PASSWORD="<DB_PASSWORD>" -e DB_URI="<DB_URI>" hudozka/feed
```