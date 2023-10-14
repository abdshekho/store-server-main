import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { EnumCustomizationType } from "../interfaces/types/productCustomization";
import Product from "./product";
import ProductCustomizationInfo from "./productCustomizationInfo";
import ProductCustomizationOption from "./productCustomizationOption";

@ObjectType()
@Entity()
class ProductCustomization extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({
        type: "enum",
        enum: EnumCustomizationType,
        default: EnumCustomizationType.dropdown,
    })
    type: EnumCustomizationType;

    @Field(() => ProductCustomizationInfo!)
    @ManyToOne((type) => ProductCustomizationInfo, (pci) => pci.customization, {
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    info: ProductCustomizationInfo;

    @Field(() => [ProductCustomizationOption!]!)
    @OneToMany((type) => ProductCustomizationOption, (pco) => pco.customization)
    options: ProductCustomizationOption[];

    @ManyToOne((type) => Product, (p) => p.customizations, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    product: ProductCustomization;
}

export default ProductCustomization;
