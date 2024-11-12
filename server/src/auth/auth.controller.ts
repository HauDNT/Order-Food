import { Controller, Post, UseGuards, Request, Get, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorators/publicEndpoint';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @Public()       // Disabled check login API with JwtAuthGuard
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post("register")
    @Public()
    register(@Body() registerDto: RegisterAuthDto) {
        return this.authService.handleRegister(registerDto);
    }
    
    @Get("profile")
    // @UseGuards(JwtAuthGuard)         // Don't need to use JwtAuthGuard with UseGuards decorator
    getProfile(@Request() req) {
        return req.user;
    }
}
