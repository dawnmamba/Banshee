import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user-auth/user.entity';
import { UserRole } from '../user-auth/user-role';
import { SEED_ADMIN_EMAIL } from './admin-user-list.constants';
import { AdminUserListService } from './admin-user-list.service';

const createdAt = new Date('2026-01-01T00:00:00.000Z');

const userRow: User = {
  id: 'user-1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  passwordHash: 'hidden',
  role: UserRole.User,
  accountNumber: 'ACC1',
  nic: '123456789V',
  mobile: '077',
  landline: null,
  address: null,
  secondaryEmail: null,
  createdAt,
};

const adminRow: User = {
  ...userRow,
  id: 'admin-1',
  email: SEED_ADMIN_EMAIL,
  firstName: 'System',
  lastName: 'Administrator',
  role: UserRole.Admin,
};

describe('AdminUserListService', () => {
  let service: AdminUserListService;
  let users: jest.Mocked<Pick<Repository<User>, 'find' | 'findOne' | 'save'>>;

  beforeEach(async () => {
    users = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const dataSource = {
      getRepository: jest.fn().mockReturnValue(users),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserListService,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(AdminUserListService);
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('returns users without password hash', async () => {
      users.find.mockResolvedValue([userRow]);

      const result = await service.listUsers();

      expect(result).toEqual([
        {
          id: 'user-1',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          role: UserRole.User,
          accountNumber: 'ACC1',
          nic: '123456789V',
          mobile: '077',
          createdAt: createdAt.toISOString(),
        },
      ]);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });

    it('filters by search on name and email', async () => {
      users.find.mockResolvedValue([userRow]);

      await service.listUsers('jane');

      const call = users.find.mock.calls[0]?.[0] as { where?: unknown[] };
      expect(Array.isArray(call.where)).toBe(true);
      expect(call.where).toHaveLength(3);
    });
  });

  describe('updateUserRole', () => {
    it('updates role when allowed', async () => {
      users.findOne.mockResolvedValue({ ...userRow });
      users.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.updateUserRole(
        'actor-admin',
        'user-1',
        UserRole.Admin,
      );

      expect(users.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.Admin }),
      );
      expect(result.role).toBe(UserRole.Admin);
    });

    it('rejects changing seed admin role', async () => {
      users.findOne.mockResolvedValue({ ...adminRow });

      await expect(
        service.updateUserRole('actor-admin', 'admin-1', UserRole.User),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects changing own role', async () => {
      users.findOne.mockResolvedValue({
        ...adminRow,
        id: 'actor-admin',
        email: 'ops@banshee.local',
      });

      await expect(
        service.updateUserRole('actor-admin', 'actor-admin', UserRole.User),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('throws when user not found', async () => {
      users.findOne.mockResolvedValue(null);

      await expect(
        service.updateUserRole('actor-admin', 'missing', UserRole.User),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
