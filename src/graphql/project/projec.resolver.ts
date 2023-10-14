import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Project from "../../entities/project";
import logic from "../../logic";
import {
    GetProjectFilters,
    ProjectResponse,
    ProjectInput,
} from "./project.types";

@Resolver()
class ProjectResolver {
    @Query(() => Project!)
    async getProjectItem(@Arg("id") id: string) {
        try {
            const item = await logic.Project.getProjectItem(id);

            return item;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => ProjectResponse!)
    async getProjects(
        @Arg("filters", { nullable: true }) filters: GetProjectFilters
    ) {
        try {
            const data = await logic.Project.getProjects(filters);

            return data;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Project!)
    async addProject(@Arg("data") data: ProjectInput) {
        try {
            const newProject = await logic.Project.addProject(data);

            return newProject;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => Project!)
    async editProject(@Arg("data") data: ProjectInput, @Arg("id") id: string) {
        try {
            const project = await logic.Project.editProject(data, id);

            return project;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteProjects(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const deleteProject = await logic.Project.deleteProjects(ids);

            return deleteProject;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async reorderProjects(@Arg("ids", () => [String!]!) ids: string[]) {
        const message = await logic.Project.reorderProjects(ids);

        return message;
    }
}

export default ProjectResolver;
