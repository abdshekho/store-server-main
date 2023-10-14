import { Field, InputType } from "type-graphql";

@InputType()
export class EmailSettingsData {
    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    banner: string;
}
