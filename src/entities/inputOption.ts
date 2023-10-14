import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import FormInput from "./formInput";
import MediaLibrary from "./mediaLibrary";

export enum OperationType {
    accumulate = "accumulate",
    percentage = "percentage",
}

@ObjectType()
@Entity()
class InputOption extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    value: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    ar_value: string;

    @Field({ nullable: true })
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    price: number;

    @Field({ nullable: true })
    @Column({
        type: "enum",
        enum: OperationType,
        default: OperationType.accumulate,
        nullable: true,
    })
    operationType: OperationType;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    ar_description: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    toSection: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    parentOption: number;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isOther: boolean;

    @Field({ nullable: true })
    @Column({ default: false, nullable: true })
    isQty: boolean;

    @Field(() => Int, { nullable: true })
    @Column({ default: 0, nullable: true })
    order: number;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.inputOptions)
    image: MediaLibrary;

    @ManyToOne(() => FormInput, (input) => input.options, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    input: FormInput;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default InputOption;
