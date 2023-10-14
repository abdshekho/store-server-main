import { ApolloError, } from "apollo-server-errors";
import { Arg,  Mutation, Resolver } from "type-graphql";
import User from "../../entities/user";
import { ErrorType } from "../../interfaces/types/error";
import logic from "../../logic";
import { generateToken, verifyToken } from "../../utils/token";
import { SigninData, SigninResponse, CreateUserInput } from "./auth.types";

@Resolver()
class AuthResolver {
    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput) {
        try {
            const user = await logic.Auth.createUser(data);

            return user;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => SigninResponse)
    async signin(@Arg("data") data: SigninData) {
        try {
            const user: any = await logic.Auth.signin(data);

            const token = generateToken({
                id: user.id,
            });

            return { user, token };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => SigninResponse)
    async activateUser(@Arg("data") data: SigninData) {
        try {
            const user: any = await logic.Auth.signin(data);

            const token = generateToken({
                id: user.id,
            });

            return { user, token };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => User, { nullable: true })
    async authOnLoad(@Arg("token") token: string) {
        try {
            const payload = verifyToken(token);

            const user = await logic.User.getUser({ id: payload.id });

            return user;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default AuthResolver;
