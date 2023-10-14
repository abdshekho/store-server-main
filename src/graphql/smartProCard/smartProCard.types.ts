import { FileUpload, GraphQLUpload } from "graphql-upload";
import { InputType, ObjectType, Field, Int } from "type-graphql";
import SmartProCard from "../../entities/smartProCard";

@InputType()
export class GetSmartProCardsFilters {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;

    @Field(() => [String!], { nullable: true })
    ids: string[];
}

@ObjectType()
export class SmartProCardsResponse {
    @Field(() => [SmartProCard!]!)
    smartProCards: SmartProCard[];

    @Field()
    count: number;
}

@InputType()
export class SmartProCardsInput {
    @Field()
    username: string;

    @Field()
    phone: string;

    @Field()
    tier: string;

    @Field(() => String, { nullable: true })
    serialNumber: string;

    @Field(() => String, { nullable: true })
    frontCard: string;
}

@InputType()
export class EditSmartProCardsInput {
    @Field(() => String, { nullable: true })
    username: string;

    @Field(() => String, { nullable: true })
    phone: string;

    @Field(() => String, { nullable: true })
    tier: string;

    @Field(() => String, { nullable: true })
    serialNumber: string;

    @Field(() => String, { nullable: true })
    frontCard: string;

    @Field(() => GraphQLUpload, { nullable: true })
    file: FileUpload;
}
