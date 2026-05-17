import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../user-auth/roles.guard';
import { ROLES_KEY } from '../user-auth/roles.decorator';
import { UserRole } from '../user-auth/user-role';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: jest.Mocked<Pick<AdminService, 'getDashboard'>>;

  beforeEach(async () => {
    adminService = {
      getDashboard: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: adminService }],
    }).compile();

    controller = module.get(AdminController);
  });

  it('returns dashboard with stats', async () => {
    adminService.getDashboard.mockResolvedValue({
      message: 'Admin dashboard',
      stats: { totalUsers: 5, adminCount: 1, userCount: 4 },
    });

    await expect(controller.getDashboard()).resolves.toEqual({
      message: 'Admin dashboard',
      stats: { totalUsers: 5, adminCount: 1, userCount: 4 },
    });
  });

  it('requires admin role via Roles decorator', () => {
    const roles = Reflect.getMetadata(ROLES_KEY, AdminController) as
      | UserRole[]
      | undefined;
    expect(roles).toEqual([UserRole.Admin]);
  });

  it('uses RolesGuard at controller level', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      AdminController,
    ) as unknown[];
    expect(guards).toContain(RolesGuard);
  });
});
