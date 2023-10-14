import { InputType, ObjectType, Field, Int } from "type-graphql";
import Service from "../../entities/service";

@InputType()
export class GetServiceFilters {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;

    @Field(() => [String!], { nullable: true })
    ids: string[];

    @Field({ nullable: true })
    parent: string;
}

@ObjectType()
export class ServiceResponse {
    @Field(() => [Service!]!)
    services: Service[];

    @Field()
    count: number;
}

@InputType()
export class ServiceInput {
    @Field(() => String!)
    title: string;

    @Field(() => String!)
    sub_title: string;

    @Field(() => String!)
    description: string;

    @Field(() => String!)
    ar_title: string;

    @Field(() => String!)
    ar_sub_title: string;

    @Field(() => String!)
    ar_description: string;

    @Field(() => String!)
    cover: string;

    @Field(() => String!)
    banner: string;

    @Field(() => [String!]!)
    gallery: string[];

    @Field(() => String, { nullable: true })
    parent: string;
}

@InputType()
export class ReorderServicesData {
    @Field()
    id: string;

    @Field(() => Int)
    order: number;
}
