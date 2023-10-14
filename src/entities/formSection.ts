import { Field, Float, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Form from "./form";
import FormInput from "./formInput";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class FormSection extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    title: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field()
    @Column({ default: "" })
    ar_title: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    ar_description: string;

    @Field(() => Float)
    @Column({ default: 0 })
    order: number;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.formSections)
    image: MediaLibrary;

    @Field(() => [FormInput!], { nullable: true })
    @OneToMany(() => FormInput, (input) => input.section)
    inputs: FormInput[];

    @ManyToOne(() => Form, (form) => form.sections, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    form: Form;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default FormSection;
