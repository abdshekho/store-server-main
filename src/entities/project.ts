import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
@Entity()
class Project extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    client: string;

    @Field()
    @Column()
    location: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column({ default: "" })
    ar_title: string;

    @Field()
    @Column({ default: "" })
    ar_client: string;

    @Field()
    @Column({ default: "" })
    ar_description: string;

    @Field(() => MediaLibrary!)
    @ManyToOne(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.projectCover
    )
    cover: MediaLibrary;

    @Field(() => MediaLibrary!)
    @ManyToOne(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.projectBanner
    )
    banner: MediaLibrary;

    @Field(() => [MediaLibrary!]!)
    @ManyToMany(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.projectGallery,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    )
    gallery: MediaLibrary[];

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    order: number;

    @Field(() => Project, { nullable: true })
    @ManyToOne(() => Project, (s) => s.children)
    parent: Project;

    @Field(() => [Project!], { nullable: true })
    @OneToMany(() => Project, (s) => s.parent, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    children: Project[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Project;
