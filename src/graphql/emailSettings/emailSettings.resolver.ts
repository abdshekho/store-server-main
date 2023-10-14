import { Arg, Mutation, Query, Resolver } from "type-graphql";
import EmailSettings from "../../entities/emailSettings";
import logic from "../../logic";
import { EmailSettingsData } from "./emailSettings.type";

@Resolver()
class EmailSettingsResolver {
    @Query(() => EmailSettings, { nullable: true })
    async getEmailSettings() {
        const emailSettings = await logic.EmailSettings.getEmailSettings();

        return emailSettings;
    }

    @Mutation(() => String!)
    async updateEmailSettings(@Arg("data") data: EmailSettingsData) {
        const [message, e] = await logic.EmailSettings.updateEmailSettings(
            data
        );

        return message;
    }
}

export default EmailSettingsResolver;
