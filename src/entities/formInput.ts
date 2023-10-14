import { Field, Int, ObjectType } from "type-graphql";
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
import FormSection from "./formSection";
import InputOption from "./inputOption";

export enum FormInputType {
    select = "select",
    radio = "radio",
    checkboxes = "checkboxes",
    text = "text",
    buttons = "buttons",
    file = "file",
}

export enum FormInputTextType {
    string = "string",
    email = "email",
    number = "number",
    date = "date",
    multiline = "multiline",
    file = "file",
}

@ObjectType()
@Entity()
class FormInput extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    label: string;

    @Field({ nullable: true })
    @Column({ nullable: true, default: "" })
    ar_label: string;

    @Field()
    @Column({
        type: "enum",
        enum: FormInputType,
        default: FormInputType.select,
    })
    type: FormInputType;

    @Field({ nullable: true })
    @Column({
        type: "enum",
        enum: FormInputTextType,
        nullable: true,
    })
    textType: FormInputTextType;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isRequired: boolean;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    toSection: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    parentInput: number;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isParent: boolean;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isConditional: boolean;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isQty: boolean;

    @Field(() => Int, { nullable: true })
    @Column({ default: 0, nullable: true })
    order: number;

    @Field(() => [InputOption!], { nullable: true })
    @OneToMany(() => InputOption, (option) => option.input)
    options: InputOption[];

    @ManyToOne(() => FormSection, (section) => section.inputs, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    section: FormSection;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default FormInput;
