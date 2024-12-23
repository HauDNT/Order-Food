import { IsNotEmpty, IsOptional } from "class-validator";

export class RegisterAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;
    
    @IsNotEmpty({message: "Password không được để trống"})
    password: string;
    
    @IsOptional()
    name: string;
}
