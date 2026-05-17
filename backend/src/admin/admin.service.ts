import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user-auth/user.entity';
import { UserRole } from '../user-auth/user-role';

export type AdminDashboardStats = {
  totalUsers: number;
  adminCount: number;
  userCount: number;
};

export type AdminDashboardResponse = {
  message: string;
  stats: AdminDashboardStats;
};

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  private get users() {
    return this.dataSource.getRepository(User);
  }

  async getDashboard(): Promise<AdminDashboardResponse> {
    const [totalUsers, adminCount, userCount] = await Promise.all([
      this.users.count(),
      this.users.count({ where: { role: UserRole.Admin } }),
      this.users.count({ where: { role: UserRole.User } }),
    ]);

    return {
      message: 'Admin dashboard',
      stats: { totalUsers, adminCount, userCount },
    };
  }
}
