## Usage

Sync Hudozka
```bash
<ENV> python3 sync.py
```


### Environment variables

**YANDEX_DISK_ACCESS_TOKEN**
For access to files using Yandex.Disk API

[How to obtain token for testing](https://tech.yandex.ru/oauth/doc/dg/tasks/get-oauth-token-docpage/)

Example: 
```bash
YANDEX_DISK_ACCESS_TOKEN=<Your_Access_Token>
```

Authorize url. Replace with your app id
```
https://oauth.yandex.ru/authorize?response_type=token&client_id=<идентификатор приложения>
```

**SYNC_LOCAL_PATH**
Path to scan files from

Example:
```bash
SYNC_LOCAL_PATH=/Users/tmshv/Yandex.Disk
```

**SYNC_STATIC**
Path to local folder for compiled files (images, uploads)

Example: 
```bash
SYNC_STATIC=~/Desktop/Hudozka Static
```

**SYNC_PROVIDER**
Type of file provider

- *fs* for local access
- *yd* for access using Yandex.Disk API (YANDEX_DISK_ACCESS_TOKEN is required)

Example: 
```bash
SYNC_PROVIDER=fs
```

**MONGO_URI**
URI for access to MongoDB
Example: mongodb://localhost:27017/hudozka

**SYNC_ENV**
- *production* default value
- *development* don't update/delete documents from DB
