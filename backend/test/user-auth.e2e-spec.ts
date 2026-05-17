import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { UserAuthService } from '../src/user-auth/user-auth.service';
import { UserRole } from '../src/user-auth/user-role';

describe('UserAuth (e2e)', () => {
  let app: INestApplication<App>;
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    authService.register.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'e2e@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.User,
      },
      accessToken: 'signed-token',
    });
    authService.logout.mockReturnValue({ ok: true });
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
    if (app) {
      await app.close();
    }
  });

  it('registers, returns me with token, and logs out', async () => {
    const jwtService = app.get(JwtService);
    const realToken = jwtService.sign({
      sub: 'user-1',
      email: 'e2e@example.com',
      role: UserRole.User,
    });

    authService.register.mockResolvedValueOnce({
      user: {
        id: 'user-1',
        email: 'e2e@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.User,
      },
      accessToken: realToken,
    });

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'e2e@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      .expect(201);

    const body = registerRes.body as {
      accessToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    };
    expect(body.user.email).toBe('e2e@example.com');
    expect(body.user.firstName).toBe('Jane');

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${realToken}`)
      .expect(200)
      .expect({
        id: 'user-1',
        email: 'e2e@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.User,
      });

    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200)
      .expect({ ok: true });
  });

  it('rejects welcome without token', async () => {
    await request(app.getHttpServer())
      .post('/welcome')
      .send({ firstName: 'Jane', lastName: 'Doe' })
      .expect(401);
  });
});
