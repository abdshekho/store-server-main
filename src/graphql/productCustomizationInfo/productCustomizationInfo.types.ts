import { Field, InputType, ObjectType } from "type-graphql";
import ProductCustomizationInfo from "../../entities/productCustomizationInfo";

@ObjectType()
export class GetProductCustomizationInfoResponse {
    @Field()
    count: string;

    @Field(() => [ProductCustomizationInfo!]!)
    customizationInfo: ProductCustomizationInfo[];
}

@InputType()
export class AddProductCustomizationInfoInput {
    @Field()
    name: string;
}

@InputType()
export class EditProductCustomizationInfoInput {
    @Field()
    name: string;
}
