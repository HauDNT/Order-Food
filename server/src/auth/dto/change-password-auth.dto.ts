import { IsNotEmpty } from "class-validator";

export class ChangePasswordAuthDto {
    @IsNotEmpty({ message: "Email không hợp lệ!" })
    email: string;

    @IsNotEmpty({ message: "Mã code không hợp lệ!" })
    code: string;

    @IsNotEmpty({ message: "Mật khẩu không hợp lệ!" })
    password: string;

    @IsNotEmpty({ message: "Xác nhận mật khẩu không hợp lệ!" })
    confirmPassword: string;
}