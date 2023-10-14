import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";
import Category from "./category";
import DynamicContent from "./dynamicContent";
import MediaLibrary from "./mediaLibrary";
import ProductCustomization from "./productCustomization";
import ProductDetails from "./productDetails";
import ProductQuantity from "./productQuantity";

@ObjectType()
@Entity()
class Product extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String!)
    @Column()
    name: string;

    @Field()
    @Column({ nullable: true, default: "" })
    ar_name: string;

    @Field(() => String!)
    @Column("text")
    about: string;

    @Field()
    @Column({ nullable: true, default: "" })
    ar_about: string;

    @Field(() => String!)
    @Column("text")
    description: string;

    @Field()
    @Column({ nullable: true, default: "" })
    ar_description: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 50, nullable: true })
    sku: string;

    @Field(() => [ProductDetails!], { nullable: true })
    @OneToMany(() => ProductDetails, (details) => details.product)
    details: ProductDetails[];

    @Field({ nullable: true })
    @Column({ default: true })
    isAvailable: boolean;

    @Field(() => [ProductCustomization!], { nullable: true })
    @OneToMany((type) => ProductCustomization, (pc) => pc.product)
    customizations: ProductCustomization[];

    @Field(() => [ProductQuantity!], { nullable: true })
    @OneToMany((type) => ProductQuantity, (pq) => pq.product)
    quantities: ProductQuantity[];

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne((type) => MediaLibrary, (media) => media.productThumbnail, {
        onUpdate: "CASCADE",
    })
    thumbnail: MediaLibrary;

    @Field(() => [MediaLibrary!], { nullable: true })
    @ManyToMany((type) => MediaLibrary, (media) => media.productShowcase)
    showcase: MediaLibrary[];

    @ManyToMany((type) => DynamicContent, (content) => content.products)
    @JoinTable()
    dynamicContentList: DynamicContent[];

    @Field(() => Category, { nullable: true })
    @ManyToOne((type) => Category, (c) => c.productCategory, {
        onUpdate: "CASCADE",
    })
    category: Category;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}

export default Product;
