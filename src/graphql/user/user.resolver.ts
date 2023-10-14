import { ApolloError } from "apollo-server-errors";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import User from "../../entities/user";
import logic from "../../logic";
import { UsersResponse, UserQueryOptions } from "./user.types";

@Resolver(() => User)
class UserResolver {
    @Query(() => UsersResponse)
    async users(@Arg("options", { nullable: true }) options: UserQueryOptions) {
        try {
            const { page, size } = options;

            const count = await User.count();
            const users = await await User.find({
                skip: page * size - size,
                take: size,
            });

            return { users, count };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => String, { nullable: true }) id: string) {
        try {
            const user = await User.findOne(id);

            return user;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => User!)
    async updateUser(
        @Arg("id", () => ID) id: string,
        @Arg("username", () => String) username: string,
        @Arg("firstName", () => String) firstName: string,
        @Arg("lastName", () => String) lastName: string,
        @Arg("email", () => String) email: string,
        @Arg("phone", () => String) phone: string
    ) {
        try {
            const user = await logic.User.updateUser({
                id,
                username,
                firstName,
                lastName,
                email,
                phone,
            });

            return user;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String)
    async deleteUser(@Arg("id", () => ID) id: string) {
        await User.delete({ id });

        return "You have successfully deleted a user.";
    }
}

export default UserResolver;
