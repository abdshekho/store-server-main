import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Check,
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
@Check("id = 1")
class EmailSettings extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn({ type: "int", default: () => "1", nullable: false })
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne(() => MediaLibrary, (md) => md.emailSettings)
    banner: MediaLibrary | null;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default EmailSettings;
