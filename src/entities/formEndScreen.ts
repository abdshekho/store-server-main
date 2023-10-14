import { Field, Float, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Form from "./form";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class FormEndScreen extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    ar_title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    ar_description: string;

    @OneToOne(() => Form, (f) => f.endScreen, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    form: Form;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (md) => md.formEndScreen)
    image: MediaLibrary | null;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default FormEndScreen;
