import { IsNotEmpty } from "class-validator";

export class SignInAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;
    
    @IsNotEmpty({message: "Password không được để trống"})
    password: string;
}
