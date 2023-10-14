import { Field, Float, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";

@ObjectType()
export class BlogLang {
    @Field()
    en: string;

    @Field(() => String, { nullable: true, defaultValue: "" })
    ar: string;
}

@ObjectType()
@Entity()
class Blog extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => BlogLang!)
    @Column("jsonb")
    author: BlogLang;

    @Field(() => BlogLang!)
    @Column("jsonb")
    title: BlogLang;

    @Field(() => BlogLang!)
    @Column("jsonb")
    intro: BlogLang;

    @Field(() => BlogLang!)
    @Column("jsonb")
    textarea: BlogLang;

    @Field(() => MediaLibrary!, { nullable: true })
    @ManyToOne((type) => MediaLibrary, (mediaibrary) => mediaibrary.blogCover)
    cover: MediaLibrary;

    @Field(() => [MediaLibrary!]!, { nullable: true })
    @ManyToMany(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.blogGallery,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    )
    gallery: MediaLibrary[];

    @Field({ nullable: true })
    @Column({ default: false })
    isDraft: boolean;

    @Field({ nullable: true })
    @Column({ default: false })
    isPublished: boolean;

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Blog;
