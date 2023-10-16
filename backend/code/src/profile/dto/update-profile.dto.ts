import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'invalid email' })
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsByteLength(8, 20)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  discreption?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsBoolean()
  finishProfile: boolean;
}
