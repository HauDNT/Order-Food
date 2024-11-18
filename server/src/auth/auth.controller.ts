import { Controller, Post, UseGuards, Request, Get, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorators/publicEndpoint';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResponseMessage } from '@/decorators/customize';
import { CheckCodeDto } from './dto/check-code-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("Fetch login")
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post("register")
    @Public()
    register(@Body() registerDto: RegisterAuthDto) {
        return this.authService.handleRegister(registerDto);
    }
    
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }

    @Post("check-code")
    @Public()
    checkCode(@Body() checkCodeDto: CheckCodeDto) {
        return this.authService.handleCheckCode(checkCodeDto);
    }

    @Post("retry-active")
    @Public()
    retryActive(@Body("email") email: string) {
        return this.authService.retryActive(email);
    }

    @Post("retry-password")
    @Public()
    retryPassword(@Body("email") email: string) {
        return this.authService.retryPassword(email);
    }

    @Post("change-password")
    @Public()
    changePassword(@Body() changePasswordAuthDto: ChangePasswordAuthDto) {
        return this.authService.changePassword(changePasswordAuthDto);
    }
}
