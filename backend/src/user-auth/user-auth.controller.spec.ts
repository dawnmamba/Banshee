import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [{ provide: UserAuthService, useValue: authService }],
    }).compile();

    controller = module.get(UserAuthController);
    jest.clearAllMocks();
  });

  it('register delegates to service', async () => {
    authService.register.mockResolvedValue({
      user: {
        id: '1',
        email: 'a@b.com',
        firstName: 'Jane',
        lastName: 'Doe',
      },
      accessToken: 'token',
    });

    const body = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'a@b.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    };

    const result = await controller.register(body);

    expect(authService.register).toHaveBeenCalledWith(body);
    expect(result.accessToken).toBe('token');
  });

  it('login delegates to service', async () => {
    authService.login.mockResolvedValue({
      user: { id: '1', email: 'a@b.com' },
      accessToken: 'token',
    });

    const result = await controller.login({
      email: 'a@b.com',
      password: 'secret123',
    });

    expect(authService.login).toHaveBeenCalled();
    expect(result.accessToken).toBe('token');
  });

  it('logout returns ok', () => {
    authService.logout.mockReturnValue({ ok: true });
    expect(controller.logout()).toEqual({ ok: true });
  });
});
