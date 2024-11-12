import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();    // Body: { username & password }

        // super({
        //     usernameField: 'email',  // Cấu hình để sử dụng 'email' thay vì mặc định của passport là 'username' | Body: { email & password }
        //     passwordField: 'password'
        // });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException("Email hoặc mật khẩu không trùng khớp!");
        }

        return user;
    }
}