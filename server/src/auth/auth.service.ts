import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/utils/bcryptPassword.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const isValidPassword = await comparePassword(password, user?.password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Email hoặc mật khẩu không trùng khớp!");
        }

        const payload = { sub: user?._id, email: user.email };
        
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
