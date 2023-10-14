import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";
import Product from "./product";

@ObjectType()
@Entity()
class ProductDetails extends BaseEntity {
    @Field(() => String!)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @OneToOne()
    // icon: string

    @Field()
    @Column({
        type: "varchar",
        length: 255,
    })
    key: string;

    @Field()
    @Column("text")
    value: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.details, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    product: Product;
}

export default ProductDetails;
