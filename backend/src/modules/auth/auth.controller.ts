import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from './strategies/jwt.strategy.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new customer account' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  login(@Request() req: { user: { id: string; email: string; role: string } }) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (revoke refresh token)' })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.sub,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  getMe(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
