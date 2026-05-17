import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../user-auth/roles.guard';
import { ROLES_KEY } from '../user-auth/roles.decorator';
import { UserRole } from '../user-auth/user-role';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    }).compile();

    controller = module.get(AdminController);
  });

  it('returns dashboard message', () => {
    expect(controller.getDashboard()).toEqual({ message: 'Admin dashboard' });
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
