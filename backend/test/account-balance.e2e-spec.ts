import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AccountBalanceService } from '../src/account-balance/account-balance.service';
import { UserAuthService } from '../src/user-auth/user-auth.service';
import { UserRole } from '../src/user-auth/user-role';

describe('AccountBalance (e2e)', () => {
  let app: INestApplication<App>;
  const accountBalanceService = {
    getBalance: jest.fn(),
  };
  const authService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    accountBalanceService.getBalance.mockResolvedValue({
      formattedBalance: 'LKR 100,500.00',
      currency: 'LKR',
      ledgerBalance: '10050000',
    });
    authService.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'e2e@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.User,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AccountBalanceService)
      .useValue(accountBalanceService)
      .overrideProvider(UserAuthService)
      .useValue(authService)
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

  it('GET /account/balance returns 401 without token', () => {
    return request(app.getHttpServer()).get('/account/balance').expect(401);
  });

  it('GET /account/balance returns balance with valid token', async () => {
    const jwt = app.get(JwtService);
    const token = jwt.sign({
      sub: 'user-1',
      email: 'e2e@example.com',
      role: UserRole.User,
    });

    const res = await request(app.getHttpServer())
      .get('/account/balance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({
      formattedBalance: 'LKR 100,500.00',
      currency: 'LKR',
      ledgerBalance: '10050000',
    });
    expect(accountBalanceService.getBalance).toHaveBeenCalledWith('user-1');
  });
});
