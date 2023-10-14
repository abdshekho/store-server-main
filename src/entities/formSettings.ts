import { Field, Float, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class FormSettings extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    title: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    description: string;

    @Field(() => MediaLibrary, { nullable: true })
    @OneToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.formSettings, {
        nullable: true,
    })
    @JoinColumn()
    image: MediaLibrary | null;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default FormSettings;
