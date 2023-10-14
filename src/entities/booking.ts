import { Field, Float, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Form from "./form";
import FormEndingScreen from "./formEndScreen";
import FormSection from "./formSection";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class Booking extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => Float)
    @Column("timestamptz")
    date: Date;

    @ManyToOne(() => Form, (f) => f.bookings)
    form: Form;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Booking;
