# Writer Draft/Publish Feature

## Overview

Add draft-save and explicit publish workflow to hudozka-writer so editors can save work-in-progress without pushing changes live.

## Data Layer

PocketBase `pages` collection fields (already applied by user):

| Field        | Type    | Purpose                                                |
|--------------|---------|--------------------------------------------------------|
| `doc`        | JSON    | Published document content (read by the main site)     |
| `draft_doc`  | JSON    | Unpublished work-in-progress, `null` when no draft     |
| `published`  | boolean | Page visibility (renamed from `draft`, inverted logic)  |

## Editor Load Behavior

When opening a page:
- If `draft_doc` is not null: load `draft_doc` into the editor, show a banner "You have unpublished changes" with a **Discard** button.
- If `draft_doc` is null: load `doc` into the editor, no banner.

## Save / Publish / Discard

| Action      | API call                                           | Effect                                    |
|-------------|----------------------------------------------------|-------------------------------------------|
| **Save**    | `update(id, { draft_doc: editorContent })`         | Persists WIP without affecting live site   |
| **Publish** | `update(id, { doc: editorContent, draft_doc: null })` | Pushes content live, clears draft       |
| **Discard** | `update(id, { draft_doc: null })`                  | Drops WIP, reloads editor from `doc`       |

No confirmation dialog on Discard.

## Toolbar Changes

Current layout: `[formatting...] [MD] [Save]`

New layout: `[formatting...] [MD] [Save] [Publish]`

- **Save** button: enabled only when editor content differs from the last-saved state. Writes to `draft_doc`.
- **Publish** button: enabled when there are any unpublished changes (unsaved edits or existing `draft_doc`). Writes to `doc`, clears `draft_doc`.

After Save: Save button becomes disabled (no new changes), Publish remains enabled (draft exists).
After Publish: both buttons become disabled (content is live, no draft).

## Draft Banner

Shown above the editor when `draft_doc` was loaded. Simple bar with text and a Discard button:

```
[You have unpublished changes]                    [Discard]
```

Clicking Discard: sends API call to clear `draft_doc`, reloads editor content from `doc`, hides the banner.

## Page Visibility Toggle

A checkbox in the app header (near page title/slug): `[ ] Published`

- Checked = page visible on site (`published: true`)
- Unchecked = page hidden (`published: false`)
- Toggling sends `update(id, { published: !current })` immediately
- Independent of save/publish content flow

## Dirty Tracking

Track whether editor content has changed since last load/save:
- On load: snapshot the initial content (serialized `DocV1`)
- On every editor change: compare current serialized content with snapshot
- After Save: update snapshot to current content
- After Publish: update snapshot to current content
- After Discard: update snapshot to `doc` content

This drives the enabled/disabled state of Save and Publish buttons.

## Type Changes

Update `PbPage` in `modules/hudozka-writer/src/types.ts`:
- Remove `draft: boolean`
- Add `published: boolean`
- Add `draft_doc: DocV1 | null`

## Files to Modify

- `modules/hudozka-writer/src/types.ts` — update `PbPage` type
- `modules/hudozka-writer/src/components/Editor.tsx` — draft loading, save/publish/discard handlers, dirty tracking
- `modules/hudozka-writer/src/components/Toolbar.tsx` — add Publish button, accept dirty/hasDraft props
- `modules/hudozka-writer/src/App.tsx` — add published toggle in header, update `handleDuplicate` for new field names
