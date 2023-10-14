import db from "../entities";
import { EmailSettingsData } from "../graphql/emailSettings/emailSettings.type";

const getEmailSettings = () =>
    new Promise(async (resolve, reject) => {
        try {
            const emailSettings = await db.EmailSettings.findOne({
                relations: ["banner"],
            });

            return resolve(emailSettings);
        } catch (err) {
            return reject(err);
        }
    });

const updateEmailSettings = (
    data: EmailSettingsData
): Promise<[string | null, string | null]> =>
    new Promise(async (resolve, reject) => {
        try {
            const emailSettings = await db.EmailSettings.findOne();

            if (!emailSettings)
                return reject([null, "email settings was not found."]);

            const foundImage = await db.MediaLibrary.findOne({
                id: data.banner,
            });

            if (foundImage) emailSettings.banner = foundImage;
            emailSettings.title = data.title;
            emailSettings.description = data.description;

            await emailSettings.save();

            return resolve([
                "you have successfully updated email settings.",
                null,
            ]);
        } catch (err) {
            return reject(err);
        }
    });

export default { getEmailSettings, updateEmailSettings };
