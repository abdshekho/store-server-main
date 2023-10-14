import db from "../entities";
import Category from "../entities/category";
import {
    BAD_USER_INPUT,
    ENTITY_NOT_FOUND,
} from "../interfaces/types/graphqlError";

const getCategory = (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOne();

            return resolve(category);
        } catch (err) {
            return reject(err);
        }
    });

const getCategories = (
    fields: (keyof Category)[] = [],
    relationFields: (keyof Category)[] = []
) =>
    new Promise(async (resolve, reject) => {
        try {
            const select = fields.map((f) => `category.${f}`);

            const sql = await db.Category.createQueryBuilder("category").select(
                select
            );

            if (relationFields.includes("parent")) {
                sql.leftJoinAndSelect("category.parent", "parent");
            }

            const categories = await sql.getMany();

            return resolve(categories);
        } catch (err) {
            return reject(err);
        }
    });

const addCategory = ({
    name,
    ar_name,
    parent,
}: {
    name: string;
    ar_name: string;
    parent: string;
}) =>
    new Promise(async (resolve, reject) => {
        try {
            let parentCategory: Category | undefined;

            if (parent) {
                parentCategory = await db.Category.findOne({ id: parent });

                if (!parentCategory)
                    return reject({
                        message: "parent category was not found",
                        code: BAD_USER_INPUT,
                    });
            }

            const category = new db.Category();

            category.name = name;
            category.ar_name = ar_name;
            if (parent && parentCategory) category.parent = parentCategory;

            await category.save();

            return resolve(category);
        } catch (err) {
            return reject(err);
        }
    });

const editCategory = (
    id: string,
    { name, ar_name }: { name: string; ar_name: string }
) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOne({ id });

            if (!category)
                return reject({
                    message: "category was not found",
                    code: ENTITY_NOT_FOUND,
                });

            category.name = name;
            category.ar_name = ar_name;

            await category.save();

            return resolve(`you have successfully updated a category: ${name}`);
        } catch (err) {
            return reject(err);
        }
    });

const deleteCategory = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            for (let id of ids) {
                const category = await db.Category.findOne(
                    { id },
                    { select: ["id", "name"] }
                );

                const childCategory = await db.Category.findOne({
                    parent: category,
                });

                if (childCategory)
                    return reject({
                        message: `can't delete a category that is a parent of other categories`,
                        code: BAD_USER_INPUT,
                    });

                if (!category)
                    return reject({
                        message: "category was not found",
                        code: ENTITY_NOT_FOUND,
                    });

                await category.remove();
            }

            return resolve(
                "You have Deleted this category/categories successfully"
            );
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getCategory,
    getCategories,
    addCategory,
    deleteCategory,
    editCategory,
};
