import { InputType, ObjectType, Field, Int, Float } from "type-graphql";
import DynamicContent from "../../entities/dynamicContent";

@InputType()
export class GetDynamicContentFilters {
    @Field(() => String, { nullable: true })
    page: string;
}

@ObjectType()
export class DynamicContentResponse {
    @Field(() => [DynamicContent!]!)
    dynamicContent: DynamicContent[];

    @Field()
    count: number;
}

@InputType()
class IActionValues {
    @Field()
    link: string;

    @Field(() => String)
    icon: string;

    @Field({ nullable: true })
    text?: string;
}

@InputType()
class IAdvsValues {
    @Field()
    link: string;

    @Field(() => String)
    banner: string;
}

@InputType()
class CompanyInfoInput {
    @Field()
    icon: string;

    @Field()
    field_one: string;

    @Field()
    field_two: string;
}

@InputType()
class CompanyInfoInputType {
    @Field()
    title: string;

    @Field()
    subTitle: string;

    @Field(() => [CompanyInfoInput!], { nullable: true })
    info: CompanyInfoInput[];
}

@InputType()
export class DynamicContentInput {
    @Field(() => String)
    type: string;

    @Field(() => String)
    page: string;

    @Field(() => Int)
    order: number;

    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    text: string;

    @Field(() => String, { nullable: true })
    ar_title: string;

    @Field(() => String, { nullable: true })
    ar_description: string;

    @Field(() => String, { nullable: true })
    ar_text: string;

    @Field(() => String, { nullable: true })
    popupHideDuration: string;

    @Field(() => String, { nullable: true })
    styles: string;

    @Field(() => String, { nullable: true })
    titleStyles: string;

    @Field(() => String, { nullable: true })
    descriptionStyles: string;

    @Field(() => String, { nullable: true })
    textStyles: string;

    @Field(() => String, { nullable: true })
    space: string;

    @Field(() => Float, { nullable: true })
    opacity: number;

    @Field(() => String, { nullable: true })
    listType: string;

    @Field(() => String, { nullable: true })
    section: string;

    @Field(() => String, { nullable: true })
    formId: string;

    @Field(() => [CompanyInfoInputType!]!, { nullable: true })
    companyInfo: CompanyInfoInputType[];

    @Field(() => [String!]!, { nullable: true })
    list: string[];

    @Field(() => [IActionValues!]!, { nullable: true })
    actions: IActionValues[];

    @Field(() => [IAdvsValues!]!, { nullable: true })
    advs: IAdvsValues[];

    @Field(() => String, { nullable: true })
    banner: string;

    @Field(() => String, { nullable: true })
    imagePosition: string;

    @Field(() => [String!]!, { nullable: true })
    gallery: string[];
}
