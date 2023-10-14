import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import DynamicContent from "../../entities/dynamicContent";
import logic from "../../logic";
import {
    GetDynamicContentFilters,
    DynamicContentResponse,
    DynamicContentInput,
} from "./dynamicContent.types";

@Resolver()
class DynamicContentResolver {
    @Query(() => DynamicContent!)
    async getDynamicContentItem(@Arg("id") id: string) {
        try {
            const item = await logic.DynamicContent.getDynamicContentItem(id);

            return item;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => DynamicContentResponse!)
    async getDynamicContents(
        @Arg("filters") filters: GetDynamicContentFilters
    ) {
        try {
            const data = await logic.DynamicContent.getDynamicContents(filters);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => DynamicContent!)
    async addDynamicContent(@Arg("data") data: DynamicContentInput) {
        try {
            const newDynamicContent =
                await logic.DynamicContent.addDynamicContent(data);

            return newDynamicContent;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => DynamicContent!)
    async editDynamicContent(
        @Arg("data") data: DynamicContentInput,
        @Arg("id") id: string
    ) {
        try {
            const dynamicContent =
                await logic.DynamicContent.editDynamicContent(data, id);

            return dynamicContent;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteDynamicContents(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const deleteDynamicContent =
                await logic.DynamicContent.deleteDynamicContents(ids);

            return deleteDynamicContent;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async reorderDynamicContent(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const message = await logic.DynamicContent.reorderDynamicContent(
                ids
            );

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default DynamicContentResolver;
