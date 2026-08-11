import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserRepository } from '@codeverse/database';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return a JWT token', async () => {
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => 'salt');
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed_password');
      jest.spyOn(UserRepository, 'create').mockResolvedValue({
        id: 'user-123',
        email: 'test@codeverse.ai',
        name: 'Test User',
        avatar: null,
        passwordHash: 'hashed_password',
        provider: 'LOCAL' as any,
        role: 'MEMBER' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register({
        email: 'test@codeverse.ai',
        password: 'Password123!',
        name: 'Test User',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.email).toBe('test@codeverse.ai');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-123',
        email: 'test@codeverse.ai',
        role: 'MEMBER',
      });
    });
  });

  describe('login', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue({
        id: 'user-123',
        email: 'test@codeverse.ai',
        name: 'Test User',
        avatar: null,
        passwordHash: 'hashed_password',
        provider: 'LOCAL' as any,
        role: 'MEMBER' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login({
        email: 'test@codeverse.ai',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.id).toBe('user-123');
    });
  });
});
