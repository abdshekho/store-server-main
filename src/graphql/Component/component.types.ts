import { InputType, ObjectType, Field, Int } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";

@InputType()
export class ComponentInput {
    @Field()
    name: string;

    @Field()
    title: boolean;

    @Field()
    description: boolean;

    @Field()
    text: boolean;

    @Field()
    banner: boolean;

    @Field()
    gallery: boolean;

    @Field()
    list: boolean;

    @Field()
    listType: boolean;
}
