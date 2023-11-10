import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TfaValidateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: '123456' })
  readonly otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'b515814e7f2f705431259634efd82497191dabd5',
  })
  readonly tfaToken: string;
}
