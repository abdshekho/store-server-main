import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import MediaLibrary from "./mediaLibrary";
import ProductCustomization from "./productCustomization";
import ProductCustomizationOptionPrice from "./productCustomizationOptionPrice";

@ObjectType()
@Entity()
class ProductCustomizationOption extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column("text")
    name: string;

    @Field(() => [ProductCustomizationOptionPrice!], { nullable: true })
    @OneToMany(
        (type) => ProductCustomizationOptionPrice,
        (oq) => oq.optionPrices
    )
    prices: ProductCustomizationOptionPrice[];

    @ManyToOne((type) => ProductCustomization, (pc) => pc.options, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    customization: ProductCustomization;

    @Field(() => MediaLibrary, { nullable: true })
    @ManyToOne((type) => MediaLibrary, (ml) => ml.productCustomizationOptions, {
        onUpdate: "CASCADE",
    })
    image: MediaLibrary;
}

export default ProductCustomizationOption;
