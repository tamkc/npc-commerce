import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service.js';
import { hashPassword, comparePasswords } from '../../common/utils/hash.util.js';
import { RegisterDto } from './dto/register.dto.js';
import { v4 as uuidv4 } from 'uuid';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair & { userId: string }> {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'CUSTOMER',
        customer: { create: {} },
      },
    });

    const tokens = await this.generateTokens({ sub: user.id, email: user.email, role: user.role });
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, userId: user.id };
  }

  async validateUser(email: string, password: string): Promise<{ id: string; email: string; role: string } | null> {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;

    const valid = await comparePasswords(password, user.passwordHash);
    if (!valid) return null;

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(user: { id: string; email: string; role: string }): Promise<TokenPair> {
    const tokens = await this.generateTokens({ sub: user.id, email: user.email, role: user.role });

    await this.prisma.client.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const stored = await this.prisma.client.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token (rotation)
    await this.prisma.client.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens({
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    });
    await this.storeRefreshToken(stored.user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.client.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await comparePasswords(oldPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid current password');

    const passwordHash = await hashPassword(newPassword);
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  private async generateTokens(payload: { sub: string; email: string; role: string }): Promise<TokenPair> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn', '15m'),
    });

    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const ms = this.parseDuration(expiresIn);
    const expiresAt = new Date(Date.now() + ms);

    await this.prisma.client.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const val = parseInt(match[1], 10);
    switch (match[2]) {
      case 's': return val * 1000;
      case 'm': return val * 60 * 1000;
      case 'h': return val * 60 * 60 * 1000;
      case 'd': return val * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
