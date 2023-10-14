import { Field, InputType } from "type-graphql";

@InputType()
export class AddCategoryFields {
    @Field()
    name: string;

    @Field({ nullable: true, defaultValue: "" })
    ar_name: string;

    @Field({ nullable: true })
    parent: string;
}

@InputType()
export class EditCategoryFields {
    @Field()
    name: string;

    @Field({ nullable: true, defaultValue: "" })
    ar_name: string;
}
