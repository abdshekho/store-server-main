import { Field, Float, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    ManyToOne,
    OneToOne,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class SmartProCard extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    phone: string;

    @Field(() => String!, { nullable: true })
    @Column({ nullable: true })
    serialNumber: string;

    @Field()
    @Column()
    tier: string;

    @Field(() => MediaLibrary!, { nullable: true })
    @ManyToOne(
        (type) => MediaLibrary,
        (mediaLibrary) => mediaLibrary.frontSmartProCard
    )
    frontCard: MediaLibrary;

    @Field(() => MediaLibrary!, { nullable: true })
    @ManyToOne(
        (type) => MediaLibrary,
        (mediaLibrary) => mediaLibrary.backSmartProCard
    )
    backCard: MediaLibrary;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default SmartProCard;
