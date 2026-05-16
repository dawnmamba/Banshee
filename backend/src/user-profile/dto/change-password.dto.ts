import { IsString, MinLength } from 'class-validator';
import { Match } from '../../user-auth/dto/match.decorator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsString()
  @MinLength(8)
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword!: string;
}
