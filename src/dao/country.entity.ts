import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Country {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 30, nullable: false})
    name: string;

    constructor(name: string) {
        this.name = name;        
    }
}
