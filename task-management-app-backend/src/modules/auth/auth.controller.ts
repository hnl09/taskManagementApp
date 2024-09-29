import { Controller, Get, Post, Body, UseGuards, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service"
import { AuthGuard } from '@nestjs/passport';;
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";
import * as FirebaseAuth from 'firebase/auth';



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

    @UseGuards(AuthGuard('bearer'))
    @Get('/reset-password')
    reset(@Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        return this.AuthService.resetPassword(token)
    }
    
}