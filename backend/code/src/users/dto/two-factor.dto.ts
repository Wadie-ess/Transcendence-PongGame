import { IsBoolean } from 'class-validator';

export class TwoFactorDto {
  @IsBoolean()
  activate: boolean;
}
