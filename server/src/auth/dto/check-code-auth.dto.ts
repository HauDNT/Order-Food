import { IsNotEmpty } from "class-validator";

export class CheckCodeDto {
    @IsNotEmpty({message: "id không hợp lệ!"})
    _id: string;
    
    @IsNotEmpty({message: "Mã code không hợp lệ!"})
    code: string;
}