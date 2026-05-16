import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

describe('UserProfileController', () => {
  let controller: UserProfileController;
  const profileService = {
    getProfile: jest.fn(),
    updateAccount: jest.fn(),
    updatePersonal: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [{ provide: UserProfileService, useValue: profileService }],
    }).compile();

    controller = module.get(UserProfileController);
    jest.clearAllMocks();
  });

  it('get delegates to service', async () => {
    const profile = { id: 'user-1', email: 'a@b.com' };
    profileService.getProfile.mockResolvedValue(profile);

    const req = { user: { id: 'user-1' } } as never;
    await expect(controller.get(req)).resolves.toEqual(profile);
    expect(profileService.getProfile).toHaveBeenCalledWith('user-1');
  });
});
