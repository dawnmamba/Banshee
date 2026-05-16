import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
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

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      WelcomeMessageController,
    ) as unknown[];
    expect(guards).toContain(JwtAuthGuard);
  });
});
