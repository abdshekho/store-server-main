import { Arg, Mutation, Query, Resolver } from "type-graphql";
import FormSettings from "../../entities/formSettings";
import logic from "../../logic";
import { EditFormSettingInput } from "./formSettings.types";

@Resolver()
class FormSettingsResolver {
    @Query(() => FormSettings, { nullable: true })
    async getFormSettingsItem() {
        const formSettings = await logic.FormSettings.getFormSettingsItem();

        return formSettings;
    }

    @Mutation(() => String!)
    async editFormSetting(
        @Arg("id") id: string,
        @Arg("data") data: EditFormSettingInput
    ) {
        const message = await logic.FormSettings.editFormSettings(id, data);

        return message;
    }
}

export default FormSettingsResolver;
