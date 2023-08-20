import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Color {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 15, nullable: false})
    color: string;

    constructor(color: string) {
        this.color = color;
    }
}
