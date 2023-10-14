import { ApolloError } from "apollo-server-errors";
import { Arg,  Mutation, Query, Resolver } from "type-graphql";
import Component from "../../entities/component";
import logic from "../../logic";
import { ComponentInput } from "./component.types";

@Resolver()
class ComponentResolver {
    @Query(() => [Component!]!)
    async getComponents() {
        try {
            const data = await logic.Component.getComponents();

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Component!)
    async addComponent(@Arg("data") data: ComponentInput) {
        try {
            const newComponent = await logic.Component.addComponent(data);

            return newComponent;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteComponents(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const deleteComponent = await logic.Component.deleteComponents(ids);

            return deleteComponent;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default ComponentResolver;
