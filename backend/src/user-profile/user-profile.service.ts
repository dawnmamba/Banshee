import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user-auth/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { isValidSriLankaNic } from './sri-lanka-nic';

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountNumber: string | null;
  nic: string | null;
  address: string | null;
  mobile: string | null;
  landline: string | null;
  secondaryEmail: string | null;
};

@Injectable()
export class UserProfileService {
  constructor(private readonly dataSource: DataSource) {}

  private get users() {
    return this.dataSource.getRepository(User);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.findUserOrThrow(userId);
    return this.toProfile(user);
  }

  async updateAccount(
    userId: string,
    dto: UpdateAccountDto,
  ): Promise<UserProfile> {
    const user = await this.findUserOrThrow(userId);
    const email = dto.email.trim().toLowerCase();

    if (email !== user.email) {
      const existing = await this.users.findOne({ where: { email } });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already in use');
      }
      user.email = email;
    }

    user.firstName = dto.firstName.trim();
    user.lastName = dto.lastName.trim();

    const saved = await this.users.save(user);
    return this.toProfile(saved);
  }

  async updatePersonal(
    userId: string,
    dto: UpdatePersonalDto,
  ): Promise<UserProfile> {
    const user = await this.findUserOrThrow(userId);
    const nic = dto.nic.trim();

    if (!isValidSriLankaNic(nic)) {
      throw new BadRequestException(
        'NIC must be 9 digits followed by V or X, or a 12-digit number',
      );
    }

    user.accountNumber = dto.accountNumber.trim();
    user.nic = nic;
    user.address = dto.address?.trim() || null;
    user.mobile = dto.mobile?.trim() || null;
    user.landline = dto.landline?.trim() || null;
    user.secondaryEmail = dto.secondaryEmail?.trim().toLowerCase() || null;

    const saved = await this.users.save(user);
    return this.toProfile(saved);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ ok: true }> {
    const user = await this.findUserOrThrow(userId);
    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.users.save(user);
    return { ok: true };
  }

  private async findUserOrThrow(userId: string): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountNumber: user.accountNumber,
      nic: user.nic,
      address: user.address,
      mobile: user.mobile,
      landline: user.landline,
      secondaryEmail: user.secondaryEmail,
    };
  }
}
