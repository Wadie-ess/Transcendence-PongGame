import { RoomType } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateRoomDto {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	type: RoomType;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(8, 32)
	password?: string;
}
