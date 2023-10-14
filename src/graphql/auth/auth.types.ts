import { InputType, ObjectType, Field, Int } from "type-graphql";
import User from "../../entities/user";

@InputType()
export class CreateUserInput {
    @Field()
    firstName: string;
    @Field()
    lastName: string;
    @Field()
    username: string;
    @Field()
    email: string;
    @Field()
    phone: string;
    @Field()
    password: string;
}

@InputType()
export class SigninData {
    @Field()
    identifier: string;
    @Field()
    password: string;
}

@ObjectType()
export class SigninResponse {
    @Field()
    user: User;
    @Field()
    token: string;
}
