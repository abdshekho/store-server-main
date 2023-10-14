import db from "../entities";
import { EditFormSettingInput } from "../graphql/formSettings/formSettings.types";

const getFormSettingsItem = () =>
    new Promise(async (resolve, reject) => {
        try {
            const formSettings = await db.FormSettings.createQueryBuilder(
                "form_settings"
            )
                .leftJoinAndSelect("form_settings.image", "image")
                .getOne();

            if (!formSettings)
                return reject({ message: "Form settings was not found." });

            return resolve(formSettings);
        } catch (err) {
            return reject(err);
        }
    });

const editFormSettings = (id: string, data: EditFormSettingInput) =>
    new Promise(async (resolve, reject) => {
        try {
            const { title, description, image } = data;

            const formSettings = await db.FormSettings.findOne({ id });

            if (!formSettings)
                return reject({ message: "Form settings was not found." });

            if (!image) formSettings.image = null;

            const foundImage = await db.MediaLibrary.findOne({ id: image });

            if (foundImage) formSettings.image = foundImage;
            formSettings.title = title;
            formSettings.description = description;

            await formSettings.save();

            return resolve(`you have successfully changed form settings.`);
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getFormSettingsItem,
    editFormSettings,
};
