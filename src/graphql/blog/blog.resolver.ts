import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Blog from "../../entities/blog";
import logic from "../../logic";
import {
    BlogChangeStatusInput,
    BlogInput,
    BlogOptions,
    BlogResponse,
} from "./blog.types";

@Resolver()
class BlogResolver {
    @Query(() => Blog!)
    async getBlogItem(@Arg("id") id: string) {
        try {
            const item = await logic.Blog.getBlogItem(id);

            return item;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => BlogResponse!)
    async getBlogs(@Arg("options") options: BlogOptions) {
        try {
            const data = await logic.Blog.getBlogs(options);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addBlog(@Arg("data") data: BlogInput) {
        try {
            await logic.Blog.addBlog(data);

            return "The Blog has ben saved! and it`s under publish/draft status";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async editBlog(@Arg("data") data: BlogInput, @Arg("id") id: string) {
        try {
            await logic.Blog.editBlog(id, data);

            return "The Blog has ben saved!";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async changeBlogStatus(@Arg("options") options: BlogChangeStatusInput) {
        try {
            await logic.Blog.changeBlogStatus(options);

            return "Blog/s status has ben changed!";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteBlogs(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            await logic.Blog.deleteBlogs(ids);

            return "Blog/s has ben deleted!";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default BlogResolver;
