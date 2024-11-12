import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/utils/bcryptPassword.util';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);

        if (user) {
            const isValidPassword = await comparePassword(password, user?.password);

            if (isValidPassword) {
                return user;
            }
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };

        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async handleRegister(registerDto: RegisterAuthDto) {
        return await this.usersService.handleRegister(registerDto);
    }
}
