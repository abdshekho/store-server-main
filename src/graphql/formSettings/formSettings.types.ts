import { Field, InputType } from "type-graphql";

@InputType()
export class EditFormSettingInput {
    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    image: string;
}
