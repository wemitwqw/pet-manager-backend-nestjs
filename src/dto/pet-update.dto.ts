import { IsDefined, IsInt, IsNotEmpty, MaxLength } from "class-validator";

export class PetUpdateDTO {
    
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @IsDefined()
    @IsInt()
    age: number;

    @IsDefined()
    @MaxLength(30)
    type: string;

    @IsDefined()
    @MaxLength(30)
    color: string;

    @IsDefined()
    @MaxLength(30)
    country: string;
}