import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QueryOffsetDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset: number;
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;
}
