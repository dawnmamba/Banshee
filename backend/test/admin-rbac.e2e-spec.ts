import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { UserAuthService } from '../src/user-auth/user-auth.service';
import { UserRole } from '../src/user-auth/user-role';

describe('Admin RBAC (e2e)', () => {
  let app: INestApplication<App>;
  const authService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    authService.getProfile.mockImplementation((id: string) => {
      if (id === 'admin-1') {
        return Promise.resolve({
          id: 'admin-1',
          email: 'admin@banshee.local',
          firstName: 'System',
          lastName: 'Administrator',
          role: UserRole.Admin,
        });
      }
      return Promise.resolve({
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.User,
      });
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserAuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows admin on /admin/dashboard', async () => {
    const jwt = app.get(JwtService);
    const token = jwt.sign({
      sub: 'admin-1',
      email: 'admin@banshee.local',
      role: UserRole.Admin,
    });

    await request(app.getHttpServer())
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ message: 'Admin dashboard' });
  });

  it('forbids user on /admin/dashboard', async () => {
    const jwt = app.get(JwtService);
    const token = jwt.sign({
      sub: 'user-1',
      email: 'user@example.com',
      role: UserRole.User,
    });

    await request(app.getHttpServer())
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
