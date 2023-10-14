import { Field, Float, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Product from "./product";
import ProductCustomizationOptionPrice from "./productCustomizationOptionPrice";

@ObjectType()
@Entity()
class ProductQuantity extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => Float)
    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

    @Field(() => Float)
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @ManyToOne((type) => Product, (p) => p.quantities, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    product: Product;

    @OneToMany((type) => ProductCustomizationOptionPrice, (q) => q.quantity)
    customizationOptionPrice: ProductCustomizationOptionPrice[];
}

export default ProductQuantity;
