import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { SRI_LANKA_NIC_PATTERN } from '../sri-lanka-nic';

export class UpdatePersonalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(SRI_LANKA_NIC_PATTERN, {
    message: 'NIC must be 9 digits followed by V or X, or a 12-digit number',
  })
  nic!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  landline?: string;

  @IsOptional()
  @IsEmail()
  secondaryEmail?: string;
}
