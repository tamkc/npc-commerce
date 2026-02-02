import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const ADMIN_URL = process.env['ADMIN_URL'] || 'http://localhost:7001';

const proxy = createProxyMiddleware({
  target: ADMIN_URL,
  changeOrigin: true,
  ws: true,
  logger: console,
});

@Injectable()
export class AdminProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    return proxy(req, res, next);
  }
}
