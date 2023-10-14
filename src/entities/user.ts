import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
@Entity()
class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    username: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field()
    @Column({ unique: true })
    phone: string;

    @Field({ nullable: true })
    @Column({ default: false })
    isBanned: boolean;

    @Field({ nullable: true })
    @Column({ default: false })
    isActive: boolean;

    @Field({ nullable: true })
    @Column({ default: false })
    isSuperAdmin: boolean;

    @Field({ nullable: true })
    @Column({ select: false, default: 0 })
    version: Number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ select: false, nullable: true })
    password: string;
}

export default User;
