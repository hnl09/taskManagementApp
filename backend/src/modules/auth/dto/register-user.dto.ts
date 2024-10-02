import { IsEmail, IsNotEmpty, MaxLength, MinLength, Matches, IsEnum, IsAlpha } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum Permissions {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class RegisterUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Permissions, { each: true })
    role: Permissions[];
}