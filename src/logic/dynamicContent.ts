import db from "../entities";
import MediaLibrary from "../entities/mediaLibrary";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";

export const populateChildren = (category: any, data: any[]) => {
    const tmpCategory = { ...category };
    const tmpChildren = data.filter((c) => c.parent?.id === category.id);
    let children: any = [];

    for (let i = 0; i < tmpChildren.length; i++) {
        const categ = populateChildren(tmpChildren[i], data);

        children.push(categ);
    }

    tmpCategory.children = children;

    return tmpCategory;
};

interface IFilters {
    page?: string;
}
const getDynamicContents = (filters: IFilters) =>
    new Promise(async (resolve, reject) => {
        try {
            let { page } = filters;

            const [data, count] = await db.DynamicContent.createQueryBuilder(
                "dc"
            )
                .leftJoinAndSelect("dc.banner", "banner")
                .leftJoinAndSelect("dc.gallery", "gallery")
                .leftJoinAndSelect("dc.products", "products")
                .leftJoinAndSelect("products.quantities", "quantities")
                .leftJoinAndSelect("products.category", "category")
                .where("dc.page = :page")
                .orderBy("dc.order", "ASC")
                .setParameters({ page })
                .getManyAndCount();

            const dynamicContent: any = [];

            for (let item of data) {
                let newItem: any = item;

                if (item.section) {
                    if (item.section === "all") {
                        const findProducts =
                            await db.Product.createQueryBuilder("product")
                                .leftJoinAndSelect(
                                    "product.quantities",
                                    "quantities"
                                )
                                .leftJoinAndSelect(
                                    "product.thumbnail",
                                    "thumbnail"
                                )
                                .leftJoinAndSelect(
                                    "product.category",
                                    "category"
                                )
                                .getMany();

                        newItem.products = findProducts;
                    } else {
                        const findCategorys = await db.Category.find({
                            relations: ["parent"],
                        });
                        const findCategory = await db.Category.findOne({
                            where: { id: item.section },
                        });

                        const categories = populateChildren(
                            findCategory,
                            findCategorys
                        );

                        const ids = [
                            categories.id,
                            ...categories.children.map((i: any) => i.id),
                        ];

                        const findProducts =
                            await db.Product.createQueryBuilder("product")
                                .where("product.category IN (:...categories)", {
                                    categories: ids,
                                })
                                .leftJoinAndSelect(
                                    "product.quantities",
                                    "quantities"
                                )
                                .leftJoinAndSelect(
                                    "product.thumbnail",
                                    "thumbnail"
                                )
                                .leftJoinAndSelect(
                                    "product.category",
                                    "category"
                                )
                                .getMany();

                        newItem.products = findProducts;
                    }
                }

                dynamicContent.push(newItem);
            }

            return resolve({ dynamicContent, count });
        } catch (err) {
            return reject(err);
        }
    });

const getDynamicContentItem = (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            let dynamicContent = await db.DynamicContent.findOne(
                { id },
                {
                    relations: [
                        "banner",
                        "gallery",
                        "products",
                        "products.thumbnail",
                        "products.quantities",
                        "products.category",
                    ],
                }
            );
            if (!dynamicContent)
                return reject({
                    message: "Not found!",
                    code: ENTITY_NOT_FOUND,
                });

            return resolve(dynamicContent);
        } catch (err) {
            return reject(err);
        }
    });

type IActionValuesProps = {
    link: string;
    icon: string;
    text?: string;
};

type IAdvsValuesProps = {
    link: string;
    banner: string;
};

type CompanyInfo = {
    title: string;
    subTitle: string;
    info: { icon: string; field_one: string; field_two: string }[];
};

interface DynamicInputProps {
    type: string;
    page: string;
    order: number;
    title?: string;
    description?: string;
    text?: string;
    ar_title?: string;
    ar_description?: string;
    ar_text?: string;
    popupHideDuration?: string;
    space?: string;
    opacity?: number;
    section?: string;
    formId?: string;
    list?: string[];
    actions?: IActionValuesProps[];
    advs?: IAdvsValuesProps[];
    companyInfo?: CompanyInfo[];
    listType?: string;
    banner?: string;
    gallery?: string[];
    styles?: string;
    titleStyles?: string;
    descriptionStyles?: string;
    textStyles?: string;
    imagePosition?: string;
}

const addDynamicContent = (data: DynamicInputProps) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                type,
                page,
                order,
                title,
                description,
                text,
                ar_title,
                ar_description,
                ar_text,
                space,
                opacity,
                listType,
                list,
                actions,
                advs,
                banner,
                gallery,
                section,
                formId,
                styles,
                titleStyles,
                descriptionStyles,
                textStyles,
                imagePosition,
                companyInfo,
                popupHideDuration,
            } = data;

            const dynamicContent = new db.DynamicContent();

            const listData: {
                id: string;
                title: string;
                ar_title: string;
                cover: MediaLibrary;
                description?: string;
                ar_description?: string;
            }[] = [];

            if (list) {
                switch (listType) {
                    case "services":
                        const serviceList = await db.Service.findByIds(list, {
                            relations: ["cover"],
                            order: { order: "ASC" },
                        });
                        for (let service of serviceList) {
                            const {
                                id,
                                title,
                                cover,
                                description,
                                ar_title,
                                ar_description,
                            } = service;
                            listData.push({
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            });
                        }
                    case "projects":
                        const projectList = await db.Project.findByIds(list, {
                            relations: ["cover"],
                        });
                        for (let project of projectList) {
                            const {
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            } = project;
                            listData.push({
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            });
                        }
                }
            }

            if (companyInfo) {
                const promise: any = [];

                for (let info of companyInfo) {
                    const InfoPromise: any = [];

                    for (let i of info.info) {
                        const findIcon = await db.MediaLibrary.findOne(i.icon);
                        if (!findIcon)
                            return reject({
                                message: "Icon not found",
                                code: ENTITY_NOT_FOUND,
                            });

                        InfoPromise.push({
                            field_one: i.field_one,
                            field_two: i.field_two,
                            icon: findIcon,
                        });
                    }

                    info.info = InfoPromise;
                    promise.push(info);
                }

                dynamicContent.companyInfo = promise;
            }

            dynamicContent.type = type;
            dynamicContent.page = page;
            dynamicContent.order = order;
            dynamicContent.formId = formId || undefined;
            dynamicContent.section = section || undefined;
            dynamicContent.title = title || undefined;
            dynamicContent.description = description || undefined;
            dynamicContent.text = text || undefined;
            dynamicContent.ar_title = ar_title || undefined;
            dynamicContent.ar_description = ar_description || undefined;
            dynamicContent.ar_text = ar_text || undefined;
            dynamicContent.space = space || undefined;
            dynamicContent.opacity = opacity || undefined;
            dynamicContent.listType = listType || undefined;
            dynamicContent.list = listData || undefined;
            dynamicContent.styles = styles || undefined;
            dynamicContent.titleStyles = titleStyles || undefined;
            dynamicContent.descriptionStyles = descriptionStyles || undefined;
            dynamicContent.textStyles = textStyles || undefined;
            dynamicContent.imagePosition = imagePosition || undefined;
            dynamicContent.popupHideDuration = popupHideDuration || undefined;

            const actionPromise: any = [];
            for (let action of actions || []) {
                const item: any = {};
                const findIcon = await db.MediaLibrary.findOne(action.icon);
                if (!findIcon)
                    return reject({
                        message: "Icon Not found!",
                        code: ENTITY_NOT_FOUND,
                    });

                item.icon = findIcon;
                item.link = action.link;
                item.text = action.text;
                actionPromise.push(item);
            }
            dynamicContent.actions = actionPromise || undefined;

            const advsPromise: any = [];
            for (let adv of advs || []) {
                const item: any = {};
                const findBanner = await db.MediaLibrary.findOne(adv.banner);
                if (!findBanner)
                    return reject({
                        message: "Banner Not found!",
                        code: ENTITY_NOT_FOUND,
                    });

                item.link = adv.link;
                item.banner = findBanner;
                advsPromise.push(item);
            }
            dynamicContent.advs = advsPromise || undefined;

            if (banner) {
                const GetBanner = await db.MediaLibrary.findOne(banner);
                dynamicContent.banner = GetBanner || undefined;
            }
            if (gallery) {
                const GetGallery = await db.MediaLibrary.findByIds(gallery);
                dynamicContent.gallery = GetGallery || undefined;
            }

            await dynamicContent.save();

            return resolve(dynamicContent);
        } catch (err) {
            return reject(err);
        }
    });

const editDynamicContent = (data: DynamicInputProps, id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                type,
                page,
                order,
                title,
                description,
                text,
                ar_title,
                ar_description,
                ar_text,
                space,
                opacity,
                list,
                actions,
                advs,
                listType,
                section,
                formId,
                banner,
                gallery,
                styles,
                titleStyles,
                descriptionStyles,
                textStyles,
                imagePosition,
                companyInfo,
                popupHideDuration,
            } = data;

            const dynamicContent = await db.DynamicContent.findOne(id);
            if (!dynamicContent)
                return reject({
                    message: "Content not found!",
                    code: ENTITY_NOT_FOUND,
                });

            const listData: {
                id: string;
                title: string;
                ar_title: string;
                cover: MediaLibrary;
                description?: string;
                ar_description?: string;
            }[] = [];

            if (list) {
                switch (listType) {
                    case "services":
                        const serviceList = await db.Service.findByIds(list, {
                            relations: ["cover"],
                            order: { order: "ASC" },
                        });
                        for (let service of serviceList) {
                            const {
                                id,
                                title,
                                cover,
                                description,
                                ar_title,
                                ar_description,
                            } = service;
                            listData.push({
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            });
                        }
                    case "projects":
                        const projectList = await db.Project.findByIds(list, {
                            relations: ["cover"],
                        });
                        for (let project of projectList) {
                            const {
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            } = project;
                            listData.push({
                                id,
                                title,
                                ar_title,
                                cover,
                                description,
                                ar_description,
                            });
                        }
                }
            }

            if (companyInfo) {
                const promise: any = [];

                for (let info of companyInfo) {
                    const InfoPromise: any = [];

                    for (let i of info.info) {
                        const findIcon = await db.MediaLibrary.findOne(i.icon);
                        if (!findIcon)
                            return reject({
                                message: "Icon not found",
                                code: ENTITY_NOT_FOUND,
                            });

                        InfoPromise.push({
                            field_one: i.field_one,
                            field_two: i.field_two,
                            icon: findIcon,
                        });
                    }

                    info.info = InfoPromise;
                    promise.push(info);
                }

                dynamicContent.companyInfo = promise;
            }

            dynamicContent.type = type;
            dynamicContent.page = page;
            dynamicContent.order = order;
            dynamicContent.formId = formId;
            dynamicContent.section = section;
            dynamicContent.title = title;
            dynamicContent.description = description;
            dynamicContent.text = text;
            dynamicContent.ar_title = ar_title;
            dynamicContent.ar_description = ar_description;
            dynamicContent.ar_text = ar_text;
            dynamicContent.space = space;
            dynamicContent.opacity = opacity;
            dynamicContent.list = listData;
            dynamicContent.listType = listType;
            dynamicContent.styles = styles;
            dynamicContent.titleStyles = titleStyles;
            dynamicContent.descriptionStyles = descriptionStyles;
            dynamicContent.textStyles = textStyles;
            dynamicContent.imagePosition = imagePosition;
            dynamicContent.popupHideDuration = popupHideDuration;

            const actionPromise: any = [];
            for (let action of actions || []) {
                const item: any = {};
                const findIcon = await db.MediaLibrary.findOne(action.icon);
                if (!findIcon)
                    return reject({
                        message: "Icon Not found!",
                        code: ENTITY_NOT_FOUND,
                    });

                item.icon = findIcon;
                item.link = action.link;
                item.text = action.text;
                actionPromise.push(item);
            }

            dynamicContent.actions = actionPromise;

            const advsPromise: any = [];
            for (let adv of advs || []) {
                const item: any = {};
                const findBanner = await db.MediaLibrary.findOne(adv.banner);
                if (!findBanner)
                    return reject({
                        message: "Banner Not found!",
                        code: ENTITY_NOT_FOUND,
                    });

                item.link = adv.link;
                item.banner = findBanner;
                advsPromise.push(item);
            }
            dynamicContent.advs = advsPromise;

            if (banner) {
                const GetBanner = await db.MediaLibrary.findOne(banner);
                dynamicContent.banner = GetBanner || undefined;
            }
            if (gallery) {
                const GetGallery = await db.MediaLibrary.findByIds(gallery);
                dynamicContent.gallery = GetGallery || undefined;
            }

            await dynamicContent.save();

            return resolve(dynamicContent);
        } catch (err) {
            return reject(err);
        }
    });

const deleteDynamicContents = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            await db.DynamicContent.delete(ids);

            return resolve(
                "You have successfully deleted a DynamicContent item/s"
            );
        } catch (err) {
            return reject(err);
        }
    });

const updateContentList = (listType: string, itemId: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const content = await db.DynamicContent.find();

            for (let item of content) {
                const NewList: any = [];

                for (let list of item?.list || []) {
                    if (list.id === itemId) {
                        switch (listType) {
                            case "services":
                                const findService = await db.Service.findOne(
                                    itemId,
                                    { relations: ["cover"] }
                                );

                                if (findService) {
                                    const {
                                        id,
                                        title,
                                        cover,
                                        description,
                                        ar_title,
                                        ar_description,
                                    } = findService;
                                    NewList.push({
                                        id,
                                        title,
                                        ar_title,
                                        cover,
                                        description,
                                        ar_description,
                                    });
                                }

                            case "projects":
                                const findProject = await db.Project.findOne(
                                    itemId,
                                    { relations: ["cover"] }
                                );

                                if (findProject) {
                                    const {
                                        id,
                                        title,
                                        ar_title,
                                        cover,
                                        description,
                                        ar_description,
                                    } = findProject;
                                    NewList.push({
                                        id,
                                        title,
                                        ar_title,
                                        cover,
                                        description,
                                        ar_description,
                                    });
                                }
                        }
                    } else NewList.push(list);
                }

                item.list = NewList;
                await item.save();
            }

            return resolve({});
        } catch (err) {
            return reject(err);
        }
    });

const reorderDynamicContent = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const promises = [];

            const dynamicContentList = await db.DynamicContent.findByIds(ids, {
                select: ["id"],
            });

            for (let i = 0; i < ids.length; i++) {
                const dynamicContent = dynamicContentList.find(
                    (dc) => dc.id === ids[i]
                );

                if (!dynamicContent) continue;
                dynamicContent.order = i;

                promises.push(dynamicContent.save());
            }

            await Promise.all(promises);

            return resolve(
                "you have successfully updated dynamic content order"
            );
        } catch (err) {
            return reject(err);
        }
    });

export default {
    updateContentList,
    addDynamicContent,
    getDynamicContents,
    getDynamicContentItem,
    deleteDynamicContents,
    editDynamicContent,
    reorderDynamicContent,
};
