import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  private readonly publicDir = join(__dirname, '..', '..', '..', 'public');

  use(req: Request, res: Response, next: NextFunction) {
    // Strip the /app prefix to get the relative path within public/
    const relativePath = req.path.replace(/^\/app/, '');

    // If the path has a file extension, let ServeStaticModule handle it
    if (/\.\w+$/.test(relativePath)) {
      return next();
    }

    // Try to find an index.html for the path (for trailingSlash: true exports)
    const indexPath = join(this.publicDir, relativePath, 'index.html');
    if (existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }

    // Fallback: serve the admin root index.html for client-side routing
    const adminIndex = join(this.publicDir, 'admin', 'index.html');
    if (existsSync(adminIndex)) {
      return res.sendFile(adminIndex);
    }

    next();
  }
}
