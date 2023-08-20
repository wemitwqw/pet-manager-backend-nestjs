import { ColorDTO } from "./color.dto";
import { CountryDTO } from "./country.dto";
import { PetTypeDTO } from "./type.dto";

export interface PetDTO {
    id?: number;
    name: string;
    age: number;
    type: PetTypeDTO;
    color: ColorDTO;
    country: CountryDTO;
}