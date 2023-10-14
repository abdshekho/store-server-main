import { ApolloError } from "apollo-server-errors";
import { Mutation, Resolver, Arg, Query } from "type-graphql";
import Product from "../../entities/product";
import logic from "../../logic";
import {
    ProductFieldsInput,
    GetProductsResponse,
    GetProductsOptions,
} from "./product.types";

@Resolver()
class ProductResolver {
    @Query(() => Product, { nullable: true })
    async getProduct(@Arg("id") id: string) {
        const product = await logic.Product.getProduct(id);

        return product;
    }

    @Query(() => GetProductsResponse!)
    async getProducts(@Arg("options") options: GetProductsOptions) {
        try {
            const { products, count } = await logic.Product.getProducts(
                options
            );

            return {
                products,
                count,
            };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addProduct(@Arg("fields") fields: ProductFieldsInput) {
        try {
            const message = await logic.Product.addProduct(fields);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async editProduct(
        @Arg("id") id: string,
        @Arg("fields") fields: ProductFieldsInput
    ) {
        try {
            const message = await logic.Product.editProduct(id, fields);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteProducts(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const message = await logic.Product.deleteProducts(ids);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default ProductResolver;
