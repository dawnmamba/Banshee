import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserAuthService } from './user-auth.service';
import { UserRole } from './user-role';

jest.mock('bcrypt');

describe('UserAuthService', () => {
  let service: UserAuthService;
  let users: jest.Mocked<Pick<Repository<User>, 'findOne' | 'create' | 'save'>>;
  let jwt: jest.Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    users = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    jwt = { sign: jest.fn().mockReturnValue('test-token') };

    const dataSource = {
      getRepository: jest.fn().mockReturnValue(users),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        { provide: DataSource, useValue: dataSource },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(UserAuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates user with role user and returns token', async () => {
      users.findOne.mockResolvedValue(null);
      users.create.mockImplementation((data) => data as User);
      users.save.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        passwordHash: 'hashed',
        role: UserRole.User,
        createdAt: new Date(),
      } as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.register({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'a@b.com',
        password: 'secret123',
        confirmPassword: 'secret123',
      });

      expect(result.user.role).toBe(UserRole.User);
      expect(users.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.User }),
      );
      expect(jwt.sign).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'a@b.com',
        role: UserRole.User,
      });
    });

    it('persists trimmed first and last name', async () => {
      users.findOne.mockResolvedValue(null);
      users.create.mockImplementation((data) => data as User);
      users.save.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        passwordHash: 'hashed',
        role: UserRole.User,
        createdAt: new Date(),
      } as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      await service.register({
        firstName: '  Jane  ',
        lastName: '  Doe  ',
        email: 'a@b.com',
        password: 'secret123',
        confirmPassword: 'secret123',
      });

      expect(users.create).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Jane', lastName: 'Doe' }),
      );
    });

    it('throws conflict for duplicate email', async () => {
      users.findOne.mockResolvedValue({
        id: 'existing',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        passwordHash: 'x',
        role: UserRole.User,
        createdAt: new Date(),
      } as User);

      await expect(
        service.register({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'a@b.com',
          password: 'secret123',
          confirmPassword: 'secret123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('returns token with role for valid credentials', async () => {
      users.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        passwordHash: 'hashed',
        role: UserRole.User,
        createdAt: new Date(),
      } as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(result.accessToken).toBe('test-token');
      expect(result.user.role).toBe(UserRole.User);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.User }),
      );
    });

    it('throws unauthorized for invalid credentials', async () => {
      users.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('returns ok true', () => {
      expect(service.logout()).toEqual({ ok: true });
    });
  });

  describe('getProfile', () => {
    it('returns user by id including role', async () => {
      users.findOne.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        passwordHash: 'hashed',
        role: UserRole.Admin,
        createdAt: new Date(),
      } as User);

      const profile = await service.getProfile('user-1');

      expect(profile).toEqual({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.Admin,
      });
    });
  });
});
