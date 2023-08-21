import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 30, nullable: false})
    username: string;

    @Column({length: 89, nullable: false})
    password: string;

    @Column({nullable: true})
    hashedRt?: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
