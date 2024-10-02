import { Controller, Post, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from "./auth.service"
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
@ApiTags('User Authentication routes to create, login and reset password on firebase')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @ApiOperation({ summary: 'Create a user account on firebase.'})
    @ApiResponse({ status: 201, description: 'User account created successfully.'})
    @ApiResponse({ status: 400, description: 'Error creating user: Error message'})
    @ApiBody({ type: RegisterUserDto })
    @Post("/signup")
    signup(@Body() userRegisterRequest: RegisterUserDto) {
        return this.AuthService.createUser(userRegisterRequest);
    }

    @ApiOperation({ summary: 'Login a user account on firebase.'})
    @ApiResponse({ status: 200, description: 'User logged in successfully.'})
    @ApiResponse({ status: 400, description: 'Error loggin in: Error message'})
    @ApiBody({ type: SigninUserDto })
    @Post("/signin")
    signin(@Body() userLoginRequest: SigninUserDto) {
        return this.AuthService.loginUser(userLoginRequest);
    }

    @ApiOperation({ summary: 'Reset a user password on firebase sending an email.'})
    @ApiResponse({ status: 200, description: 'Password reset email sent successfully.'})
    @ApiResponse({ status: 400, description: 'Error reseting password:: Error message'})
    @ApiBody({ type: ResetPasswordDto })
    @Post('/reset-password')
    reset(@Body() resetPasswordRequest: ResetPasswordDto) {
        return this.AuthService.resetPassword(resetPasswordRequest)
    }
    
}