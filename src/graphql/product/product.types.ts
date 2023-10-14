import { Field, Float, ID, InputType, Int, ObjectType } from "type-graphql";
import Product from "../../entities/product";
import { EnumCustomizationType } from "../../interfaces/types/productCustomization";

@InputType()
export class GetProductsOptions {
    @Field()
    page: number;

    @Field()
    size: number;

    @Field()
    search: string;

    @Field()
    section: string;
}

@InputType()
export class ProductFieldsInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String, { nullable: true })
    about: string;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    ar_name: string;

    @Field(() => String, { nullable: true })
    ar_about: string;

    @Field(() => String, { nullable: true })
    ar_description: string;

    @Field(() => String, { nullable: true })
    thumbnail: string;

    @Field(() => [String!]!)
    showcase: string[];

    @Field(() => String, { nullable: true })
    sku: string;

    @Field(() => [ProductDetailsData!]!)
    details: ProductDetailsData[];

    @Field(() => [ProductCustomizationInput!]!)
    customizations: ProductCustomizationInput[];

    @Field(() => [ProductQuantities!]!)
    quantities: ProductQuantities[];

    @Field(() => String, { nullable: true })
    category: string;
}

@InputType()
class ProductQuantities {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => Float)
    quantity: number;

    @Field(() => Float)
    price: number;
}

@InputType()
class ProductDetailsData {
    @Field(() => String, { nullable: true })
    id: string;

    @Field()
    key: string;

    @Field()
    value: string;
}

@InputType()
class ProductCustomizationOptionPricesInput {
    @Field(() => String, { nullable: true })
    id: string;

    @Field(() => String, { nullable: true })
    image: string;

    @Field(() => Float)
    quantity: number;

    @Field(() => Float)
    price: number;
}

@InputType()
class ProductCustomizationOptionInput {
    @Field(() => String, { nullable: true })
    id: string;

    @Field()
    name: string;

    @Field(() => [ProductCustomizationOptionPricesInput!]!)
    prices: ProductCustomizationOptionPricesInput[];

    @Field(() => ID, { nullable: true })
    image: string;
}

@InputType()
class ProductCustomizationInput {
    @Field(() => String, { nullable: true })
    id: string;

    @Field()
    type: EnumCustomizationType;

    @Field()
    info: string;

    @Field(() => [ProductCustomizationOptionInput!]!)
    options: ProductCustomizationOptionInput[];
}

@ObjectType()
export class GetProductsResponse {
    @Field()
    count: number;

    @Field(() => [Product!]!)
    products: Product[];
}
