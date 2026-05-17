import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TransactionHistoryService } from '../src/transaction-history/transaction-history.service';
import { UserAuthService } from '../src/user-auth/user-auth.service';

describe('TransactionHistory (e2e)', () => {
  let app: INestApplication<App>;
  const transactionHistoryService = {
    getHistory: jest.fn(),
  };
  const authService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    transactionHistoryService.getHistory.mockResolvedValue({
      dateFrom: '2021-01-01',
      dateTo: '2021-01-31',
      transactions: [],
    });
    authService.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'e2e@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransactionHistoryService)
      .useValue(transactionHistoryService)
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

  it('GET /transactions/history returns 401 without token', () => {
    return request(app.getHttpServer())
      .get('/transactions/history?startDate=2021-01-01&endDate=2021-01-31')
      .expect(401);
  });

  it('GET /transactions/history returns history with valid token', async () => {
    const jwt = app.get(JwtService);
    const token = jwt.sign({ sub: 'user-1', email: 'e2e@example.com' });

    const res = await request(app.getHttpServer())
      .get('/transactions/history?startDate=2021-01-01&endDate=2021-01-31')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({
      dateFrom: '2021-01-01',
      dateTo: '2021-01-31',
      transactions: [],
    });
    expect(transactionHistoryService.getHistory).toHaveBeenCalledWith(
      'user-1',
      {
        startDate: '2021-01-01',
        endDate: '2021-01-31',
      },
    );
  });
});
