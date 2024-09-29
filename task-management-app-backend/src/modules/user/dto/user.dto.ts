import { IsEmail, IsNotEmpty, MaxLength, MinLength, Matches, IsEnum, IsAlpha } from "class-validator";

enum Permissions {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
        message: "Passowrd is too weak, it must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    })
    password: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    lastName: string;

    @IsNotEmpty()
    @IsEnum(Permissions, { each: true })
    role: Permissions[];
}