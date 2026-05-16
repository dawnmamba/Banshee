import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user-auth/user.entity';
import { UserProfileService } from './user-profile.service';

jest.mock('bcrypt');

const baseUser: User = {
  id: 'user-1',
  email: 'a@b.com',
  firstName: 'Jane',
  lastName: 'Doe',
  passwordHash: 'hashed',
  accountNumber: null,
  nic: null,
  address: null,
  mobile: null,
  landline: null,
  secondaryEmail: null,
  createdAt: new Date(),
};

describe('UserProfileService', () => {
  let service: UserProfileService;
  let users: jest.Mocked<Pick<Repository<User>, 'findOne' | 'save'>>;

  beforeEach(async () => {
    users = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const dataSource = {
      getRepository: jest.fn().mockReturnValue(users),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(UserProfileService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns full profile', async () => {
      users.findOne.mockResolvedValue({
        ...baseUser,
        accountNumber: 'ACC1',
        nic: '123456789V',
        address: 'Colombo',
        mobile: '077',
        landline: '011',
        secondaryEmail: 'alt@b.com',
      });

      const profile = await service.getProfile('user-1');

      expect(profile).toEqual({
        id: 'user-1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
        accountNumber: 'ACC1',
        nic: '123456789V',
        address: 'Colombo',
        mobile: '077',
        landline: '011',
        secondaryEmail: 'alt@b.com',
      });
    });
  });

  describe('updateAccount', () => {
    it('updates first name, last name, and email', async () => {
      users.findOne
        .mockResolvedValueOnce({ ...baseUser })
        .mockResolvedValueOnce(null);
      users.save.mockImplementation((user) => Promise.resolve(user as User));

      const result = await service.updateAccount('user-1', {
        firstName: 'Janet',
        lastName: 'Smith',
        email: 'new@b.com',
      });

      expect(result.firstName).toBe('Janet');
      expect(result.lastName).toBe('Smith');
      expect(result.email).toBe('new@b.com');
      expect(users.save).toHaveBeenCalled();
    });

    it('throws conflict when email is taken', async () => {
      users.findOne
        .mockResolvedValueOnce({ ...baseUser })
        .mockResolvedValueOnce({
          ...baseUser,
          id: 'other-user',
          email: 'taken@b.com',
        });

      await expect(
        service.updateAccount('user-1', {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'taken@b.com',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('updatePersonal', () => {
    it('saves personal and contact fields', async () => {
      users.findOne.mockResolvedValue({ ...baseUser });
      users.save.mockImplementation((user) => Promise.resolve(user as User));

      const result = await service.updatePersonal('user-1', {
        accountNumber: 'ACC99',
        nic: '123456789V',
        address: 'Kandy',
        mobile: '0771234567',
        landline: '0812345678',
        secondaryEmail: 'alt@example.com',
      });

      expect(result.accountNumber).toBe('ACC99');
      expect(result.nic).toBe('123456789V');
      expect(result.address).toBe('Kandy');
      expect(result.mobile).toBe('0771234567');
    });

    it('rejects invalid NIC format', async () => {
      users.findOne.mockResolvedValue({ ...baseUser });

      await expect(
        service.updatePersonal('user-1', {
          accountNumber: 'ACC99',
          nic: 'invalid',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('updates password when current password is valid', async () => {
      users.findOne.mockResolvedValue({ ...baseUser });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      users.save.mockResolvedValue({ ...baseUser, passwordHash: 'new-hash' });

      const result = await service.changePassword('user-1', {
        currentPassword: 'oldpass12',
        newPassword: 'newpass12',
        confirmPassword: 'newpass12',
      });

      expect(result).toEqual({ ok: true });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass12', 10);
    });

    it('throws unauthorized for wrong current password', async () => {
      users.findOne.mockResolvedValue({ ...baseUser });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'wrongpass',
          newPassword: 'newpass12',
          confirmPassword: 'newpass12',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
