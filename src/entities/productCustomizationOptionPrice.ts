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
import ProductCustomizationOption from "./productCustomizationOption";
import ProductQuantity from "./productQuantity";

@ObjectType()
@Entity()
class ProductCustomizationOptionPrice extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => Float)
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @ManyToOne((type) => ProductCustomizationOption, (o) => o.prices, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    optionPrices: ProductCustomizationOption;

    @Field(() => ProductQuantity)
    @ManyToOne((type) => ProductQuantity, (p) => p.customizationOptionPrice, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    quantity: ProductQuantity;
}

export default ProductCustomizationOptionPrice;
