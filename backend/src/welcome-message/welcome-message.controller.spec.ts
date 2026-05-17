import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { RolesGuard } from '../user-auth/roles.guard';
import { ROLES_KEY } from '../user-auth/roles.decorator';
import { UserRole } from '../user-auth/user-role';
import { WelcomeMessageController } from './welcome-message.controller';
import { WelcomeMessageService } from './welcome-message.service';

describe('WelcomeMessageController', () => {
  let controller: WelcomeMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomeMessageController],
      providers: [WelcomeMessageService],
    }).compile();

    controller = module.get(WelcomeMessageController);
  });

  it('createWelcome returns message from service', () => {
    const result = controller.createWelcome({
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(result).toEqual({ message: 'Welcome, Jane Doe' });
  });

  it('is protected by JwtAuthGuard and RolesGuard for users', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      WelcomeMessageController,
    ) as unknown[];
    expect(guards).toContain(JwtAuthGuard);
    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, WelcomeMessageController)).toEqual([
      UserRole.User,
    ]);
  });
});
