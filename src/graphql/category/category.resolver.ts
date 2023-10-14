import { ApolloError } from "apollo-server-errors";
import { Mutation, Query, Resolver, Arg, Info } from "type-graphql";
import Category from "../../entities/category";
import logic from "../../logic";
import { AddCategoryFields, EditCategoryFields } from "./category.types";
import graphqlUtil from "../../utils/graphql";

@Resolver()
class CategoryResolver {
    @Query(() => Category, { nullable: true })
    async getCategory(@Arg("id") id: string) {
        try {
            const category = await logic.Category.getCategory(id);

            return category;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => [Category!]!)
    async getCategories(@Info() info: any) {
        try {
            const { activeFields, relationFields } = graphqlUtil.getFields<
                keyof Category
            >(info, ["parent"]);

            const categories = await logic.Category.getCategories(
                activeFields,
                relationFields
            );

            return categories;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Category!)
    async addCategory(
        @Arg("fields")
        { name, ar_name, parent }: AddCategoryFields
    ) {
        try {
            const category = await logic.Category.addCategory({
                name,
                ar_name,
                parent,
            });

            return category;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async editCategory(
        @Arg("id") id: string,
        @Arg("fields") fields: EditCategoryFields
    ) {
        try {
            const message = await logic.Category.editCategory(id, fields);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteCategory(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const message = await logic.Category.deleteCategory(ids);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default CategoryResolver;
