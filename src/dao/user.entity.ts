import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 30, nullable: false})
    username: string;

    @Column({length: 89, nullable: false})
    password: string;

    @Column()
    hashedRt?: string;
}
