import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QueryOffsetDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;
}
