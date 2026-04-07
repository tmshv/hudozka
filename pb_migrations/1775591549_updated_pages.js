/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "json1182570132",
    "maxSize": 0,
    "name": "draft",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool1182570132",
    "name": "published",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // remove field
  collection.fields.removeById("json1182570132")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool1182570132",
    "name": "draft",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
