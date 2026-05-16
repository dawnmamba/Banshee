import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('WelcomeMessage (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /welcome returns welcome message', () => {
    return request(app.getHttpServer())
      .post('/welcome')
      .send({ firstName: 'Jane', lastName: 'Doe' })
      .expect(201)
      .expect({ message: 'Welcome, Jane Doe' });
  });

  it('POST /welcome rejects empty names', () => {
    return request(app.getHttpServer())
      .post('/welcome')
      .send({ firstName: '', lastName: 'Doe' })
      .expect(400);
  });
});
