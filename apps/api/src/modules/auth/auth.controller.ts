import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'User authentication login' })
  login(@Body() body: any) {
    return {
      token: 'demo-jwt-token-codeverse-v1',
      user: {
        id: 'user-1',
        username: 'GrimReaper6526',
        email: 'dev@codeverse.ai',
        role: 'owner',
      },
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User session logout' })
  logout() {
    return { loggedOut: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user session metadata' })
  getMe() {
    return {
      id: 'user-1',
      username: 'GrimReaper6526',
      email: 'dev@codeverse.ai',
      role: 'owner',
    };
  }
}
