/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp"
    ],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [
      "100x100",
      "600x0",
      "1600x0"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp"
    ],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [
      "100x100",
      "600x0",
      "1600x0"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
