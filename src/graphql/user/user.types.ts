import { InputType, ObjectType, Field, Int } from "type-graphql";
import User from "../../entities/user";

@InputType()
export class UserQueryOptions {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;
}

@ObjectType()
export class UsersResponse {
    @Field(() => [User!]!)
    users: User[];

    @Field()
    count: number;
}
