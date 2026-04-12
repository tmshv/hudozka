# PocketBase Setup Guide

Create 5 collections in the PocketBase admin UI. The migration script will populate all records — you only need to create empty collections with the correct fields.

## API Rules (same for all collections)

- List/Search/View: leave empty (public read)
- Create/Update/Delete: `@request.auth.id != ""`

## Step 1 — Create collection `tags`

| Field  | Type       | Settings         |
|--------|------------|------------------|
| `name` | Plain text | Required         |
| `slug` | Plain text | Required, Unique |

## Step 2 — Create collection `images`

| Field      | Type       | Settings                                                   |
|------------|------------|------------------------------------------------------------|
| `file`     | File       | Required, Max 1, MIME: `image/jpeg, image/png, image/webp`, Thumb sizes: `100x100`, `400x0`, `1200x0` |
| `alt`      | Plain text | *(optional)*                                               |
| `caption`  | Plain text | *(optional)*                                               |
| `width`    | Number     | Required                                                   |
| `height`   | Number     | Required                                                   |
| `blur`     | Plain text | *(optional, blurhash)*                                     |
| `filename` | Plain text | *(optional, original filename)*                            |

## Step 3 — Create collection `files`

| Field      | Type       | Settings                                          |
|------------|------------|---------------------------------------------------|
| `file`     | File       | Required, Max 1, MIME: any                        |
| `preview`  | File       | Max 1, MIME: `image/jpeg, image/webp`, Thumb sizes: `100x100`, `400x0` |
| `title`    | Plain text | *(optional)*                                      |
| `mime`     | Plain text | *(optional)*                                      |
| `size`     | Number     | *(optional, bytes)*                               |
| `filename` | Plain text | *(optional, original filename)*                   |

## Step 4 — Create collection `pages`

Create fields in this order:

| #  | Field     | Type       | Settings                                               |
|----|-----------|------------|--------------------------------------------------------|
| 1  | `title`   | Plain text | Required                                               |
| 2  | `slug`    | Plain text | Required, Unique                                       |
| 3  | `excerpt` | Plain text | *(optional)*                                           |
| 4  | `date`    | Date       | *(leave blank for undated pages)*                      |
| 5  | `cover`   | Relation   | Collection: `images`. Max select: 1                    |
| 6  | `content` | JSON       | *(content blocks reference image/file IDs directly)*   |
| 7  | `tags`    | Relation   | Collection: `tags`. Max select: unlimited              |

## Step 5 — Create collection `kv` (key-value store for home + menu)

| Field  | Type       | Settings         |
|--------|------------|------------------|
| `key`  | Plain text | Required, Unique |
| `data` | JSON       | Required         |
