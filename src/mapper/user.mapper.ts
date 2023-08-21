import { Injectable } from "@nestjs/common";
import { User } from "src/dao/user.entity";
import { UserDTO } from "src/dto/user.dto";

@Injectable()
export class UserMapper {
    public async entityToDto(entity: User): Promise<UserDTO> {
        const dto: UserDTO = ({
            id: entity.id,
            username: entity.username,
        });
        return dto;
    }
}