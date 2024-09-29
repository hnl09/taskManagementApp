import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service"
import { AuthGuard } from '@nestjs/passport';;
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('bearer'))
    @Get('/test')
    test() {
        return "Hello from user controller";
    }

    @Post("/signup")
    signup(@Body() userRegisterRequest: RegisterUserDto) {
        return this.userService.createUser(userRegisterRequest);
    }

    @Post("/signin")
    signin(@Body() userLoginRequest: SigninUserDto) {
        return this.userService.loginUser(userLoginRequest);
    }
}