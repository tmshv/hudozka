# migrate-to-pocketbase

One-shot Strapi → PocketBase migration.

## Usage

```
cp .env.example .env
# fill in credentials
npm install
npm run migrate
```

Requires Node 24+ (uses `--experimental-strip-types`).

Assumes all 5 PocketBase collections already exist
(see `docs/plans/completed/20260403-pocketbase-setup-guide.md`).
Assumes collections are empty — script does not upsert.
