import { PetType } from "src/dao/type.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Color } from "./color.entity";
import { Country } from "./country.entity";
import { User } from "./user.entity";

@Entity()
export class Pet {
    
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 50, nullable: false})
    name: string;

    @Column('int')
    age: number;

    @ManyToOne(() => PetType, {cascade: true, nullable: false})
    @JoinColumn({name: 'type_id', referencedColumnName: 'id'})
    type: PetType;

    @ManyToOne(() => Color, {cascade: true, nullable: false})
    @JoinColumn({name: 'color_id', referencedColumnName: 'id'})
    color: Color;

    @ManyToOne(() => Country, {cascade: true, nullable: false})
    @JoinColumn({name: 'country_id', referencedColumnName: 'id'})
    country: Country;

    @ManyToOne(() => User, {cascade: true, nullable: false})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user?: User;
}