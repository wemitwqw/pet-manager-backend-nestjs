export class UserDTO {
    id: number;
    username: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.username = name;
    }
}