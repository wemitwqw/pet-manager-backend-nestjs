import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PetType {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 15, nullable: false})
    animal: string;

    constructor(animal: string) {
        this.animal = animal;
    }
}
