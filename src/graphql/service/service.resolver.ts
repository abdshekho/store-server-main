import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Service from "../../entities/service";
import logic from "../../logic";
import {
    GetServiceFilters,
    ServiceResponse,
    ServiceInput,
    ReorderServicesData,
} from "./service.types";

@Resolver()
class ServiceResolver {
    @Query(() => Service!)
    async getServiceItem(@Arg("id") id: string) {
        try {
            const item = await logic.Service.getServiceItem(id);

            return item;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => ServiceResponse!)
    async getServices(@Arg("filters") filters: GetServiceFilters) {
        try {
            // const { page, size } = filters;
            const data = await logic.Service.getServices(filters);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => [Service!]!)
    async getParentServices() {
        try {
            const services = await Service.find({ order: { order: "ASC" } });

            return services;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Service!)
    async addService(@Arg("data") data: ServiceInput) {
        try {
            const newService = await logic.Service.addService(data);

            return newService;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Service!)
    async editService(@Arg("data") data: ServiceInput, @Arg("id") id: string) {
        try {
            const service = await logic.Service.editService(data, id);

            return service;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteServices(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const deleteServices = await logic.Service.deleteServices(ids);

            return deleteServices;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async reorderServices(
        @Arg("data", () => [ReorderServicesData!]!) data: ReorderServicesData[]
    ) {
        try {
            const message = await logic.Service.reorderServices(data);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default ServiceResolver;
