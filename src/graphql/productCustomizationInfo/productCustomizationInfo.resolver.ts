import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import logic from "../../logic";
import {
    AddProductCustomizationInfoInput,
    EditProductCustomizationInfoInput,
    GetProductCustomizationInfoResponse,
} from "./productCustomizationInfo.types";

@Resolver()
class ProductCustomizationInfoResolver {
    @Query(() => GetProductCustomizationInfoResponse!)
    async getProductCustomizationInfo() {
        try {
            const { count, customizationInfo } =
                await logic.ProductCustomizationInfo.getCustomizationInfo();

            return {
                count,
                customizationInfo,
            };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addProductCustomizationInfo(
        @Arg("fields") fields: AddProductCustomizationInfoInput
    ) {
        try {
            const message =
                await logic.ProductCustomizationInfo.addCustomizationInfo(
                    fields
                );

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async editProductCustomizationInfo(
        @Arg("id") id: string,
        @Arg("fields") fields: EditProductCustomizationInfoInput
    ) {
        try {
            const message =
                await logic.ProductCustomizationInfo.editCustomizationInfo(
                    id,
                    fields
                );

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default ProductCustomizationInfoResolver;
