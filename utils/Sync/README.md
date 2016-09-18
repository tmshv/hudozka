## Usage

Sync Hudozka
```bash
<ENV> python3 sync.py
```


### Environment variables

**YANDEX_DISK_ACCESS_TOKEN**
For access to files using Yandex.Disk API

Example: 
```bash
YANDEX_DISK_ACCESS_TOKEN=<Your_Access_Token>
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
