import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { extname, join, resolve } from 'path';
import { randomUUID } from 'crypto';

export const IMAGE_UPLOAD_SCOPES = ['listings', 'hardware', 'users'] as const;
export type ImageUploadScope = (typeof IMAGE_UPLOAD_SCOPES)[number];

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface StoredImage {
  fileName: string;
  filePath: string;
  imageUrl: string;
  scope: ImageUploadScope;
}

@Injectable()
export class ImageStorageService {
  private readonly uploadsRoot = resolve(process.cwd(), 'uploads');

  async saveImage(file: Express.Multer.File, scope: ImageUploadScope): Promise<StoredImage> {
    this.assertSupportedImage(file);
    await this.ensureScopeDirectory(scope);

    const extension = extname(file.originalname).toLowerCase() || this.extensionFromMime(file.mimetype);
    const fileName = `${Date.now()}-${randomUUID()}${extension}`;
    const directory = this.scopeDirectory(scope);
    const filePath = join(directory, fileName);

    await fs.writeFile(filePath, file.buffer);

    return {
      fileName,
      filePath,
      imageUrl: `/uploads/${scope}/${fileName}`,
      scope,
    };
  }

  async ensureAllScopeDirectories(): Promise<void> {
    await Promise.all(IMAGE_UPLOAD_SCOPES.map((scope) => this.ensureScopeDirectory(scope)));
  }

  parseScope(scope: string): ImageUploadScope {
    if ((IMAGE_UPLOAD_SCOPES as readonly string[]).includes(scope)) {
      return scope as ImageUploadScope;
    }

    throw new BadRequestException(`Unsupported image upload scope: ${scope}`);
  }

  // TODO(PRODUCTION): Replace local image storage with cloud storage (Cloudflare R2 or S3) before production deployment.
  // This service is the only place that should know whether files are stored on disk or in a remote object store.
  async deleteLocalImageByUrl(imageUrl: string): Promise<void> {
    if (!imageUrl.startsWith('/uploads/')) {
      return;
    }

    const relativePath = imageUrl.replace('/uploads/', '');
    const filePath = resolve(this.uploadsRoot, relativePath);

    if (!filePath.startsWith(this.uploadsRoot)) {
      return;
    }

    try {
      await fs.unlink(filePath);
    } catch {
      // Local cleanup is best-effort in development.
    }
  }

  private async ensureScopeDirectory(scope: ImageUploadScope): Promise<void> {
    await fs.mkdir(this.scopeDirectory(scope), { recursive: true });
  }

  private scopeDirectory(scope: ImageUploadScope): string {
    return join(this.uploadsRoot, scope);
  }

  private assertSupportedImage(file: Express.Multer.File): void {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only jpg, png, and webp images are allowed.');
    }

    const extension = extname(file.originalname).toLowerCase();
    if (extension && !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
      throw new BadRequestException('Only jpg, png, and webp images are allowed.');
    }
  }

  private extensionFromMime(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      default:
        throw new BadRequestException('Unsupported image type.');
    }
  }
}
