/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_yj534DmAHs` ON `pages` (`slug`)"
    ],
    "name": "pages"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_yj534DmAHs` ON `posts` (`slug`)"
    ],
    "name": "posts"
  }, collection)

  return app.save(collection)
})
