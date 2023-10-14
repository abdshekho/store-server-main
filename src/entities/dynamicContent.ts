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
} from "typeorm";
import MediaLibrary from "./mediaLibrary";
import Product from "./product";

@ObjectType()
class ListValues {
    @Field(() => String!)
    id: string;

    @Field()
    title: string;

    @Field({ defaultValue: "" })
    ar_title: string;

    @Field(() => MediaLibrary!, { nullable: true })
    cover: MediaLibrary;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    ar_description?: string;
}

@ObjectType()
class ActionValues {
    @Field()
    link: string;

    @Field(() => MediaLibrary!, { nullable: true })
    icon: MediaLibrary;

    @Field({ nullable: true })
    text?: string;
}

@ObjectType()
class AdvsValues {
    @Field()
    link: string;

    @Field(() => MediaLibrary!, { nullable: true })
    banner: MediaLibrary;
}

@ObjectType()
class CompanyInfo {
    @Field(() => MediaLibrary!)
    icon: MediaLibrary;

    @Field(() => String!, { nullable: true, defaultValue: null })
    field_one: string;

    @Field(() => String!, { nullable: true, defaultValue: null })
    field_two: string;
}

@ObjectType()
class CompanyInfoEntiti {
    @Field()
    title: string;

    @Field()
    subTitle: string;

    @Field(() => [CompanyInfo!], { nullable: true })
    info: CompanyInfo[];
}

@ObjectType()
@Entity()
class DynamicContent extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    type: string;

    @Field()
    @Column()
    page: string;

    @Field(() => Int)
    @Column()
    order: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    text?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    ar_title?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    ar_description?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    ar_text?: string;

    @Field({ nullable: true })
    @Column({ nullable: true, default: "right" })
    imagePosition?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    section?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    popupHideDuration?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    formId?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    styles?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    titleStyles?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionStyles?: string;

    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    textStyles?: string;

    @Field({ nullable: true })
    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0.0,
    })
    opacity?: number;

    @Field({ nullable: true })
    @Column({ nullable: true, default: null })
    space?: string;

    @Field({ nullable: true })
    @Column({ default: null, nullable: true })
    listType?: string;

    @Field(() => [ListValues!], { nullable: true })
    @Column("jsonb", { nullable: true })
    list?: ListValues[];

    @Field(() => [ActionValues!], { nullable: true })
    @Column("jsonb", { nullable: true })
    actions?: ActionValues[];

    @Field(() => [AdvsValues!], { nullable: true })
    @Column("jsonb", { nullable: true })
    advs?: AdvsValues[];

    @Field(() => [CompanyInfoEntiti!], { nullable: true })
    @Column("jsonb", { nullable: true })
    companyInfo?: CompanyInfoEntiti[];

    @Field(() => [Product!], { nullable: true })
    @ManyToMany((type) => Product, (product) => product.dynamicContentList, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    products?: Product[];

    @Field(() => MediaLibrary!, { nullable: true })
    @ManyToOne(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.dynamicContentBanner
    )
    banner?: MediaLibrary;

    @Field(() => [MediaLibrary!]!, { nullable: true })
    @ManyToMany(
        (type) => MediaLibrary,
        (mediaibrary) => mediaibrary.dynamicContentGallery,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    )
    gallery?: MediaLibrary[];

    @Field(() => Float)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Float)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default DynamicContent;
