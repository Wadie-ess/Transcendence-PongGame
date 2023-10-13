import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SetAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    roomId: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newAdmin: string;
}