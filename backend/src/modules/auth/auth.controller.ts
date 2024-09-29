import { Controller, Get, Post, Body, UseGuards, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service"
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";


@Controller("auth")
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @Post("/signup")
    signup(@Body() userRegisterRequest: RegisterUserDto) {
        return this.AuthService.createUser(userRegisterRequest);
    }

    @Post("/signin")
    signin(@Body() userLoginRequest: SigninUserDto) {
        return this.AuthService.loginUser(userLoginRequest);
    }

    @Post('/reset-password')
    reset(@Body() resetPasswordRequest: ResetPasswordDto) {
        return this.AuthService.resetPassword(resetPasswordRequest)
    }
    
}