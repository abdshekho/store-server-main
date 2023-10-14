import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class Component extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    name: string;

    @Field()
    @Column()
    title: boolean;

    @Field()
    @Column()
    description: boolean;

    @Field()
    @Column()
    text: boolean;

    @Field()
    @Column()
    list: boolean;

    @Field()
    @Column()
    listType: boolean;

    @Field()
    @Column()
    banner: boolean;

    @Field()
    @Column()
    gallery: boolean;
}

export default Component;
