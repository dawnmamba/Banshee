import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../user-auth/user-role';
import { AdminUserListController } from './admin-user-list.controller';
import { AdminUserListService } from './admin-user-list.service';

describe('AdminUserListController', () => {
  let controller: AdminUserListController;
  let service: jest.Mocked<
    Pick<AdminUserListService, 'listUsers' | 'updateUserRole'>
  >;

  beforeEach(async () => {
    service = {
      listUsers: jest.fn(),
      updateUserRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUserListController],
      providers: [{ provide: AdminUserListService, useValue: service }],
    }).compile();

    controller = module.get(AdminUserListController);
  });

  it('listUsers delegates to service with search', async () => {
    service.listUsers.mockResolvedValue([]);

    await controller.listUsers({ search: 'jane' });

    expect(service.listUsers).toHaveBeenCalledWith('jane');
  });

  it('updateRole delegates actor id and body', async () => {
    const updated = {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      role: UserRole.Admin,
      accountNumber: null,
      nic: null,
      mobile: null,
      createdAt: new Date().toISOString(),
    };
    service.updateUserRole.mockResolvedValue(updated);

    const req = { user: { id: 'admin-actor' } } as Parameters<
      AdminUserListController['updateRole']
    >[0];

    const result = await controller.updateRole(req, 'user-1', {
      role: UserRole.Admin,
    });

    expect(service.updateUserRole).toHaveBeenCalledWith(
      'admin-actor',
      'user-1',
      UserRole.Admin,
    );
    expect(result).toEqual(updated);
  });
});
