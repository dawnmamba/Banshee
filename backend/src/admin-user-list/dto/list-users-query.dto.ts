import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListUsersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}
