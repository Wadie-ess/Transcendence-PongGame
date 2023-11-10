import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class QueryOffsetDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset: number;
  @ApiProperty({ maximum: 20 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(20)
  limit: number;
}
