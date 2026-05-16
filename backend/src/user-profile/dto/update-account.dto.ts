import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsEmail()
  email!: string;
}
