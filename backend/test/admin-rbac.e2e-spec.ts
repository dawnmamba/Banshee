import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AdminService } from '../src/admin/admin.service';
import { UserAuthService } from '../src/user-auth/user-auth.service';
import { UserRole } from '../src/user-auth/user-role';

describe('Admin RBAC (e2e)', () => {
  let app: INestApplication<App>;
  const authService = {
    getProfile: jest.fn(),
  };
  const adminService = {
    getDashboard: jest.fn(),
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

    adminService.getDashboard.mockResolvedValue({
      message: 'Admin dashboard',
      stats: { totalUsers: 1, adminCount: 1, userCount: 0 },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserAuthService)
      .useValue(authService)
      .overrideProvider(AdminService)
      .useValue(adminService)
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
      .expect({
        message: 'Admin dashboard',
        stats: { totalUsers: 1, adminCount: 1, userCount: 0 },
      });
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
