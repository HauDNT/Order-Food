import { Controller, Post, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signin")
    async signIn(@Body() signInAuthDto: SignInAuthDto) {
        return this.authService.signIn(signInAuthDto.email, signInAuthDto.password);
    }
}
