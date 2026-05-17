import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { User } from '../user-auth/user.entity';
import { UserRole } from '../user-auth/user-role';
import { SEED_ADMIN_EMAIL } from './admin-user-list.constants';

export type AdminUserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accountNumber: string | null;
  nic: string | null;
  mobile: string | null;
  createdAt: string;
};

@Injectable()
export class AdminUserListService {
  constructor(private readonly dataSource: DataSource) {}

  private get users() {
    return this.dataSource.getRepository(User);
  }

  async listUsers(search?: string): Promise<AdminUserListItem[]> {
    const term = search?.trim();
    const rows = term
      ? await this.users.find({
          where: [
            { firstName: ILike(`%${term}%`) },
            { lastName: ILike(`%${term}%`) },
            { email: ILike(`%${term}%`) },
          ],
          order: { createdAt: 'DESC' },
        })
      : await this.users.find({ order: { createdAt: 'DESC' } });

    return rows.map((user) => this.toListItem(user));
  }

  async updateUserRole(
    actorId: string,
    userId: string,
    role: UserRole,
  ): Promise<AdminUserListItem> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === SEED_ADMIN_EMAIL) {
      throw new ForbiddenException('Cannot change role of the system admin');
    }

    if (user.id === actorId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    user.role = role;
    const saved = await this.users.save(user);
    return this.toListItem(saved);
  }

  private toListItem(user: User): AdminUserListItem {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accountNumber: user.accountNumber,
      nic: user.nic,
      mobile: user.mobile,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
