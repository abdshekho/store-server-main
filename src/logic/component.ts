import db from "../entities";
import {
    BAD_USER_INPUT,
    ENTITY_NOT_FOUND,
} from "../interfaces/types/graphqlError";

const getComponents = () =>
    new Promise(async (resolve, reject) => {
        try {
            const components = await db.Component.find();

            return resolve(components);
        } catch (err) {
            return reject(err);
        }
    });

interface ComponentProps {
    name: string;
    title: boolean;
    text: boolean;
    description: boolean;
    banner: boolean;
    gallery: boolean;
    list: boolean;
    listType: boolean;
}

const addComponent = (data: ComponentProps) =>
    new Promise(async (resolve, reject) => {
        try {
            const component = await db.Component.insert(data);

            return resolve(component);
        } catch (err) {
            return reject(err);
        }
    });

const deleteComponents = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            await db.Component.delete(ids);

            return resolve("You delete the component/s");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getComponents,
    addComponent,
    deleteComponents,
};
