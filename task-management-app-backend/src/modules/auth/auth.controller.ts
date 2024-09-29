import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service"
import { AuthGuard } from '@nestjs/passport';;
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";


@Controller("auth")
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @UseGuards(AuthGuard('bearer'))
    @Get('/test')
    test() {
        return "Hello from auth controller";
    }

    @Post("/signup")
    signup(@Body() userRegisterRequest: RegisterUserDto) {
        return this.AuthService.createUser(userRegisterRequest);
    }

    @Post("/signin")
    signin(@Body() userLoginRequest: SigninUserDto) {
        return this.AuthService.loginUser(userLoginRequest);
    }
}