import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { QueryOffsetDto } from 'src/friends/dto/query-ofsset-dto';

export class ListRoomsDto extends QueryOffsetDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  joined: boolean;
}
