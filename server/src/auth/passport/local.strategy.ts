import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException("Email hoặc mật khẩu không trùng khớp!");
        }

        if (user.isActive === false) {
            throw new BadRequestException("Tài khoản chưa được kích hoạt!");
        }

        return user;
    }
}