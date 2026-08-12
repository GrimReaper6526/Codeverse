import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'dummy-client-id',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'dummy-client-secret',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') ||
        'http://localhost:4000/api/v1/auth/github/callback',
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : `${profile.username}@github.user`;
    const name = profile.displayName || profile.username || 'GitHub User';
    const avatar =
      profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined;

    return this.authService.validateGithubUser({
      email,
      name,
      avatar,
      githubId: profile.id,
    });
  }
}
