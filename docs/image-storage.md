# Local Image Storage

## Overview

Development image uploads are stored on the local filesystem under the repository-level `uploads/` directory.

Directory structure:

- `uploads/listings/`
- `uploads/hardware/`
- `uploads/users/`

The backend serves these files from `/uploads/...`, so a saved listing image URL looks like:

- `/uploads/listings/1712345678901-uuid.webp`

## Upload flow

### Generic upload endpoint

- `POST /api/images/upload/:scope`
- `scope` must be one of:
  - `listings`
  - `hardware`
  - `users`
- form-data field:
  - `image`

Rules:

- allowed types: `jpg`, `jpeg`, `png`, `webp`
- max file size: `5 MB`
- filenames are generated with a timestamp and UUID

### Listing-specific upload endpoint

- `POST /api/listings/:id/images`
- requires seller/admin authentication
- form-data field:
  - `image`
- optional form field:
  - `isPrimary=true`

This endpoint:

1. stores the file in `uploads/listings/`
2. creates a `listing_images` database row
3. returns the saved `imageUrl` and `isPrimary` flag

## Persistence in Docker

The backend container mounts the repository uploads directory:

- `./uploads:/app/uploads`

That means uploaded files survive container rebuilds during development.

## Database model

Listing image metadata is stored in `listing_images` with fields such as:

- `id`
- `listing_id`
- `image_url`
- `is_primary`
- `sort_order`

## Cloud migration path

The filesystem logic is isolated in:

- `backend/src/modules/image-storage/image-storage.service.ts`

That service is the replacement point for production storage.

To migrate to Cloudflare R2 or S3 later:

1. replace the file write/delete logic in `ImageStorageService`
2. return cloud object URLs instead of `/uploads/...`
3. keep controller/service call sites unchanged

This avoids a larger refactor because the rest of the application only consumes `imageUrl` values and does not care where the file is physically stored.
