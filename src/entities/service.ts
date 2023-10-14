import { Field, Float, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class Service extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    sub_title: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column({ default: "" })
    ar_title: string;

    @Field()
    @Column({ default: "" })
    ar_sub_title: string;

    @Field()
    @Column({ default: "" })
    ar_description: string;

    @Field(() => MediaLibrary!)
    @ManyToOne(() => MediaLibrary, (mediaibrary) => mediaibrary.serviceCover)
    cover: MediaLibrary;

    @Field(() => MediaLibrary!)
    @ManyToOne(() => MediaLibrary, (mediaibrary) => mediaibrary.serviceBanner)
    banner: MediaLibrary;

    @Field(() => [MediaLibrary!]!)
    @ManyToMany(
        () => MediaLibrary,
        (mediaibrary) => mediaibrary.serviceGallery,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    )
    gallery: MediaLibrary[];

    @Field(() => Int)
    @Column({ nullable: true, default: 0 })
    order: number;

    @Field(() => Service, { nullable: true })
    @ManyToOne(() => Service, (s) => s.children)
    parent: Service;

    @Field(() => [Service!], { nullable: true })
    @OneToMany(() => Service, (s) => s.parent, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    children: Service[];

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Service;
