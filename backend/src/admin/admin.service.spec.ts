import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user-auth/user.entity';
import { UserRole } from '../user-auth/user-role';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let users: jest.Mocked<Pick<Repository<User>, 'count'>>;

  beforeEach(async () => {
    users = {
      count: jest.fn(),
    };

    const dataSource = {
      getRepository: jest.fn().mockReturnValue(users),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, { provide: DataSource, useValue: dataSource }],
    }).compile();

    service = module.get(AdminService);
    jest.clearAllMocks();
  });

  it('returns dashboard stats from user counts', async () => {
    users.count
      .mockResolvedValueOnce(15)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(13);

    const result = await service.getDashboard();

    expect(result).toEqual({
      message: 'Admin dashboard',
      stats: {
        totalUsers: 15,
        adminCount: 2,
        userCount: 13,
      },
    });
    expect(users.count).toHaveBeenNthCalledWith(1);
    expect(users.count).toHaveBeenNthCalledWith(2, {
      where: { role: UserRole.Admin },
    });
    expect(users.count).toHaveBeenNthCalledWith(3, {
      where: { role: UserRole.User },
    });
  });
});
