import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export class AuthDTO {

    @IsDefined()
    @IsNotEmpty()
    @MaxLength(89)
    username: string;

    @IsDefined()
    @IsNotEmpty()
    @MaxLength(100)
    password: string;
}