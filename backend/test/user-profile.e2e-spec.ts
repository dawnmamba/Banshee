import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { UserProfileService } from '../src/user-profile/user-profile.service';

describe('UserProfile (e2e)', () => {
  let app: INestApplication<App>;
  const profileService = {
    getProfile: jest.fn(),
    updateAccount: jest.fn(),
    updatePersonal: jest.fn(),
    changePassword: jest.fn(),
  };

  const fullProfile = {
    id: 'user-1',
    email: 'e2e@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    accountNumber: 'ACC1',
    nic: '123456789V',
    address: null,
    mobile: null,
    landline: null,
    secondaryEmail: null,
  };

  beforeEach(async () => {
    profileService.getProfile.mockResolvedValue(fullProfile);
    profileService.updateAccount.mockResolvedValue(fullProfile);
    profileService.updatePersonal.mockResolvedValue(fullProfile);
    profileService.changePassword.mockResolvedValue({ ok: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserProfileService)
      .useValue(profileService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /profile returns 401 without token', () => {
    return request(app.getHttpServer()).get('/profile').expect(401);
  });

  it('GET /profile returns profile with valid token', async () => {
    const { JwtService } = await import('@nestjs/jwt');
    const jwt = app.get(JwtService);
    const token = jwt.sign({ sub: 'user-1', email: 'e2e@example.com' });

    const res = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual(fullProfile);
  });

  it('PATCH /profile/account updates account', async () => {
    const { JwtService } = await import('@nestjs/jwt');
    const jwt = app.get(JwtService);
    const token = jwt.sign({ sub: 'user-1', email: 'e2e@example.com' });

    await request(app.getHttpServer())
      .patch('/profile/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Janet',
        lastName: 'Doe',
        email: 'new@example.com',
      })
      .expect(200);

    expect(profileService.updateAccount).toHaveBeenCalled();
  });
});
