import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessgaeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
