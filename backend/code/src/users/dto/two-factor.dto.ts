import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TwoFactorAction {
  ENABLE = 'enable',
  DISABLE = 'disable',
}
export class TwoFactorDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'MC41emVyMjFqbG4w' })
  secret: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '745896' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TwoFactorAction)
  @ApiProperty({ example: TwoFactorAction.ENABLE })
  action: string;
}
