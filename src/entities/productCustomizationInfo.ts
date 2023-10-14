import { Field, ObjectType } from "type-graphql";
import {
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Entity,
    BaseEntity,
} from "typeorm";
import ProductCustomization from "./productCustomization";

@ObjectType()
@Entity()
class ProductCustomizationInfo extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column("text")
    name: string;

    @OneToMany((type) => ProductCustomization, (pc) => pc.info)
    customization: ProductCustomization[];
}

export default ProductCustomizationInfo;
