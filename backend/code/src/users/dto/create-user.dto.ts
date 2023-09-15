import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refreshedHash?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  intraId?: string;

  @IsOptional()
  @IsBoolean()
  profileFinished?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  intraUsername?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tfaEnabled?: boolean;
}
