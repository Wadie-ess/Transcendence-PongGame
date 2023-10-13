// import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ChangeOwnerDto{
    // @ApiProperty()
    @IsNotEmpty()
    @IsString()
    roomId: string;
    @IsNotEmpty()
    @IsString()
    NewOwnerId: string;

}