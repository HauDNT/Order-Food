import { Controller, Post, UseGuards, Request, Get, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorators/publicEndpoint';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResponseMessage } from '@/decorators/customize';

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
}
