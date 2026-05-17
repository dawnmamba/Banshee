import { IsEnum } from 'class-validator';
import { UserRole } from '../../user-auth/user-role';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
