import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Form from "../../entities/form";
import logic from "../../logic";
import {
    FormData,
    GetFormsOptions,
    GetFormsResponse,
    SubmitFormData,
} from "./form.types";

@Resolver()
class FormResolver {
    @Query(() => Form, { nullable: true })
    async getForm(@Arg("id") id: string) {
        try {
            const form = await logic.Form.getForm(id);

            return form;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => GetFormsResponse!)
    async getForms(@Arg("options") options: GetFormsOptions) {
        try {
            const result = await logic.Form.getForms(options);

            return result;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addForm(@Arg("data") data: FormData) {
        try {
            await logic.Form.addForm(data);

            return "you have successfully added a form";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async editForm(@Arg("id") id: string, @Arg("data") data: FormData) {
        try {
            await logic.Form.editForm(id, data);

            return "you have successfully edited a form";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteForm(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const message = await logic.Form.deleteForm(ids);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async reorderForms(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            const message = await logic.Form.reorderForms(ids);

            return message;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async submitForm(@Arg("data") data: SubmitFormData) {
        const message = await logic.Form.submitForm(data);

        return message;
    }
}

export default FormResolver;
