import db from "../entities";
import ProductCustomizationInfo from "../entities/productCustomizationInfo";
import { BAD_USER_INPUT } from "../interfaces/types/graphqlError";

const getCustomizationInfo = (): Promise<{
    count: number;
    customizationInfo: ProductCustomizationInfo[];
}> =>
    new Promise(async (resolve, reject) => {
        try {
            const [customizationInfo, count] =
                await db.ProductCustomizationInfo.findAndCount();

            return resolve({
                customizationInfo,
                count,
            });
        } catch (err) {
            return reject(err);
        }
    });

const addCustomizationInfo = (data: { name: string }) =>
    new Promise(async (resolve, reject) => {
        try {
            const { name } = data;

            await db.ProductCustomizationInfo.insert({
                name,
            });

            return resolve(
                "You have successfully created a new customization information."
            );
        } catch (err) {
            return reject(err);
        }
    });

const editCustomizationInfo = (id: string, data: { name: string }) =>
    new Promise(async (resolve, reject) => {
        try {
            const { name } = data;

            const foundCustomizationInfo =
                await db.ProductCustomizationInfo.findOne({ name });

            if (foundCustomizationInfo)
                return reject({
                    message: "a customization info already have this name.",
                    code: BAD_USER_INPUT,
                });

            const customizationInfo = await db.ProductCustomizationInfo.findOne(
                { id }
            );

            if (!customizationInfo)
                return reject({
                    message: "customization info was not found.",
                    code: BAD_USER_INPUT,
                });

            customizationInfo.name = name;

            await customizationInfo.save();

            return resolve(
                "you have successfully edited a customization information."
            );
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getCustomizationInfo,
    addCustomizationInfo,
    editCustomizationInfo,
};
