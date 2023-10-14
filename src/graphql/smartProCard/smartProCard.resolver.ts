import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import SmartProCard from "../../entities/smartProCard";
import logic from "../../logic";
import {
    EditSmartProCardsInput,
    GetSmartProCardsFilters,
    SmartProCardsInput,
    SmartProCardsResponse,
} from "./smartProCard.types";

@Resolver()
class SmartProCardResolver {
    @Query(() => SmartProCard!)
    async getSmartProCardItem(@Arg("id") id: string) {
        try {
            const data = await logic.SmartProCard.getSmartProCardItem(id);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => SmartProCardsResponse!)
    async getSmartProCards(@Arg("filters") filters: GetSmartProCardsFilters) {
        try {
            const data = await logic.SmartProCard.getSmartProCards(filters);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addSmartProCards(
        @Arg("data", () => [SmartProCardsInput!]) data: SmartProCardsInput[]
    ) {
        try {
            const smartProCards = await logic.SmartProCard.addSmartProCards(
                data
            );

            return smartProCards;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async eidtSmartProCard(
        @Arg("id") id: string,
        @Arg("data", () => EditSmartProCardsInput!) data: EditSmartProCardsInput
    ) {
        try {
            const card = await logic.SmartProCard.editSmartProCard(data, id);

            return card;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteSmartProCards(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const deleteSmartProCards =
                await logic.SmartProCard.deleteSmartProCards(ids);

            return deleteSmartProCards;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default SmartProCardResolver;
