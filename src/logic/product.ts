import db from "../entities";
import MediaLibrary from "../entities/mediaLibrary";
import Product from "../entities/product";
import ProductCustomization from "../entities/productCustomization";
import ProductCustomizationOption from "../entities/productCustomizationOption";
import {
    BAD_USER_INPUT,
    ENTITY_NOT_FOUND,
} from "../interfaces/types/graphqlError";
import { EnumCustomizationType } from "../interfaces/types/productCustomization";
import { populateChildren } from "./dynamicContent";

const getProduct = (id: string): Promise<Product | undefined> =>
    new Promise(async (resolve, reject) => {
        try {
            const product = await db.Product.createQueryBuilder("product")
                .leftJoinAndSelect("product.details", "details")
                .leftJoinAndSelect("product.thumbnail", "thumbnail")
                .leftJoinAndSelect("product.showcase", "showcase")
                .leftJoinAndSelect("product.category", "category")
                .leftJoinAndSelect("product.quantities", "quantities")
                .leftJoinAndSelect("product.customizations", "customizations")
                .leftJoinAndSelect("customizations.info", "info")
                .leftJoinAndSelect("customizations.options", "options")
                .leftJoinAndSelect("options.image", "image")
                .leftJoinAndSelect("options.prices", "prices")
                .leftJoinAndSelect("prices.quantity", "quantity")
                .orderBy("product.createdAt", "DESC")
                .where("product.id = :productId")
                .setParameters({ productId: id })
                .getOne();

            return resolve(product);
        } catch (err) {
            return reject(err);
        }
    });

const getProducts = (options: {
    page: number;
    size: number;
    search: string;
    section?: string;
}): Promise<{ products: Product[]; count: number }> =>
    new Promise(async (resolve, reject) => {
        try {
            const { page, size, section, search } = options;

            const query = db.Product.createQueryBuilder("product")
                .leftJoinAndSelect("product.details", "details")
                .leftJoinAndSelect("product.quantities", "quantities")
                .leftJoinAndSelect("product.thumbnail", "thumbnail")
                .leftJoinAndSelect("product.showcase", "showcase")
                .leftJoinAndSelect("product.category", "category")
                .leftJoinAndSelect("product.customizations", "customizations")
                .leftJoinAndSelect("customizations.info", "info")
                .leftJoinAndSelect("customizations.options", "options")
                .leftJoinAndSelect("options.image", "image")
                .leftJoinAndSelect("options.prices", "prices")
                .leftJoinAndSelect("prices.quantity", "quantity")
                .orderBy("product.createdAt", "DESC")
                .skip(page * size - size)
                .take(size);

            if (search) {
                query
                    .where(`product.name ILIKE :name`)
                    .setParameter("name", `%${search}%`);
            }
            if (section) {
                const findCategorys = await db.Category.find({
                    relations: ["parent"],
                });
                const findCategory = await db.Category.findOne({
                    where: { id: section },
                });

                const categories = await populateChildren(
                    findCategory,
                    findCategorys
                );

                const ids = [
                    categories.id,
                    ...categories.children.map((i: any) => i.id),
                ];

                if (search)
                    query.andWhere(`product.category IN (:...categories)`, {
                        categories: ids,
                    });
                else
                    query.where(`product.category IN (:...categories)`, {
                        categories: ids,
                    });
            }

            const [products, count] = await query.getManyAndCount();

            return resolve({ products, count });
        } catch (err) {
            return reject(err);
        }
    });

const addProduct = (data: {
    name: string;
    about: string;
    description: string;
    ar_name: string;
    ar_about: string;
    ar_description: string;
    showcase: string[];
    thumbnail: string;
    category: string;
    sku: string;
    details: { id?: string; key: string; value: string }[];
    quantities: { id?: string; price: number; quantity: number }[];
    customizations: {
        id?: string;
        type: EnumCustomizationType;
        info: string;
        options: {
            id?: string;
            name: string;
            prices: { id?: string; quantity: number; price: number }[];
            image?: string;
        }[];
    }[];
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                name,
                description,
                about,
                ar_name,
                ar_description,
                ar_about,
                sku,
                details,
                customizations,
                quantities,
                category,
                thumbnail,
                showcase,
            } = data;

            const customizationsPromise = [];

            const qtysPromise = [];

            for (let i = 0; i < quantities.length; i++) {
                const quantity = new db.ProductQuantity();

                quantity.price = quantities[i].price;
                quantity.quantity = quantities[i].quantity;

                qtysPromise.push(quantity.save());
            }

            const newQuantities = await Promise.all(qtysPromise);

            for (let i = 0; i < customizations.length; i++) {
                const productCustomizationInfo =
                    await db.ProductCustomizationInfo.findOne({
                        id: customizations[i].info,
                    });

                if (!productCustomizationInfo)
                    return reject({
                        message: "customization information was not found.",
                    });

                const productCustomizationOptionsPromise = [];

                for (let j = 0; j < customizations[i].options.length; j++) {
                    const productCustomizationOption =
                        new db.ProductCustomizationOption();

                    productCustomizationOption.name =
                        customizations[i].options[j].name;

                    const pricePromise = [];

                    for (let priceItem of customizations[i].options[j].prices) {
                        const optionPrice =
                            new db.ProductCustomizationOptionPrice();

                        const foundQuantity = newQuantities.find(
                            (q) => q.quantity === priceItem.quantity
                        );

                        if (!foundQuantity)
                            return reject({
                                message: "Quantity not found!",
                                code: ENTITY_NOT_FOUND,
                            });

                        optionPrice.price = priceItem.price;
                        optionPrice.quantity = foundQuantity;

                        pricePromise.push(optionPrice.save());
                    }

                    const optionPrices = await Promise.all(pricePromise);

                    if (
                        customizations[i].type === "card" &&
                        customizations[i].options[j].image
                    ) {
                        const foundImage = await db.MediaLibrary.findOne(
                            customizations[i].options[j].image
                        );

                        if (!foundImage)
                            return reject({
                                message: "image not found",
                                ENTITY_NOT_FOUND,
                            });

                        productCustomizationOption.image = foundImage;
                    }

                    productCustomizationOption.prices = optionPrices;

                    productCustomizationOptionsPromise.push(
                        productCustomizationOption.save()
                    );
                }

                const customizationOptions = await Promise.all(
                    productCustomizationOptionsPromise
                );

                const productCustomization = new db.ProductCustomization();

                productCustomization.type = customizations[i].type;
                productCustomization.info = productCustomizationInfo;
                productCustomization.options = customizationOptions;

                customizationsPromise.push(productCustomization.save());
            }

            const productCustomizations = await Promise.all(
                customizationsPromise
            );

            const productDetails = await db.ProductDetails.createQueryBuilder()
                .insert()
                .values(details.map((d) => ({ key: d.key, value: d.value })))
                .execute();

            const showcasePromise: MediaLibrary[] = [];

            const findShowCase = await db.MediaLibrary.findByIds(showcase);
            showcasePromise.push(...findShowCase);

            const showcaseList = await Promise.all(showcasePromise);

            const product = new db.Product();

            const findThumbnail = await db.MediaLibrary.findOne(thumbnail);
            if (!findThumbnail)
                return reject({
                    message: "thumbnail was not found",
                    code: ENTITY_NOT_FOUND,
                });

            const foundCategory = await db.Category.findOne(category);
            if (!foundCategory)
                return reject({
                    message: "category was not found",
                    code: ENTITY_NOT_FOUND,
                });

            product.name = name;
            product.description = description;
            product.about = about;
            product.ar_name = ar_name;
            product.ar_about = ar_about;
            product.ar_description = ar_description;
            product.sku = sku;
            product.details = productDetails.raw;
            product.customizations = productCustomizations;
            product.thumbnail = findThumbnail;
            product.showcase = showcaseList;
            product.category = foundCategory;
            product.quantities = newQuantities;

            await product.save();

            return resolve("you have successfully added a product.");
        } catch (err) {
            return reject(err);
        }
    });

const editProduct = (
    id: string,
    fields: {
        name: string;
        about: string;
        description: string;
        ar_name: string;
        ar_about: string;
        ar_description: string;
        showcase: string[];
        thumbnail: string;
        category: string;
        sku: string;
        details: { id?: string; key: string; value: string }[];
        quantities: { id?: string; price: number; quantity: number }[];
        customizations: {
            id?: string;
            type: EnumCustomizationType;
            info: string;
            options: {
                id?: string;
                name: string;
                prices: { id?: string; quantity: number; price: number }[];
                image?: string;
            }[];
        }[];
    }
) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                thumbnail,
                showcase,
                category,
                name,
                description,
                about,
                ar_name,
                ar_description,
                ar_about,
                sku,
                details,
                customizations,
                quantities,
            } = fields;

            const product = await getProduct(id);

            if (!product)
                return reject({
                    message: "no product was found.",
                    code: BAD_USER_INPUT,
                });

            // thumbnail
            const productThumbnail = await db.MediaLibrary.findOne(thumbnail);

            if (!productThumbnail)
                return reject({
                    message: "thumbnail was not found.",
                    code: ENTITY_NOT_FOUND,
                });

            // showcase
            const productShowcase = await db.MediaLibrary.findByIds(showcase);

            // category
            const productCategory = await db.Category.findOne(category);

            // details
            const detailsPromise = [];
            const delDetailsPromise = [];

            for (let i = 0; i < details.length; i++) {
                const id = details[i].id;
                let detail = product.details.find((d) => d.id === id);

                if (!detail) detail = new db.ProductDetails();

                detail.key = details[i].key;
                detail.value = details[i].value;

                detailsPromise.push(detail.save());
            }

            for (let i = 0; i < product.details.length; i++) {
                const id = product.details[i].id;
                const detail = details.find((d) => d.id === id);

                if (!detail)
                    delDetailsPromise.push(
                        db.ProductDetails.remove(product.details[i])
                    );
            }

            // quantities
            const quantitiesPromise = [];
            const delQuantitiesPromise = [];

            for (let i = 0; i < quantities.length; i++) {
                const id = quantities[i].id;
                let quantity = product.quantities.find((q) => q.id === id);

                if (!quantity) quantity = new db.ProductQuantity();

                quantity.quantity = quantities[i].quantity;
                quantity.price = quantities[i].price;

                quantitiesPromise.push(quantity.save());
            }

            for (let i = 0; i < product.quantities.length; i++) {
                const id = product.quantities[i].id;
                const quantity = quantities.find((q) => q.id === id);

                if (!quantity)
                    delQuantitiesPromise.push(
                        db.ProductQuantity.remove(product.quantities[i])
                    );
            }

            const productQuantities = await Promise.all(quantitiesPromise);

            // customizations
            const customizationsPromise = [];
            const deleteCustomizationsPromise = [];

            for (let i = 0; i < customizations.length; i++) {
                let customization = product.customizations.find(
                    (c) => c.id === customizations[i].id
                );

                if (!customization) {
                    customization = new db.ProductCustomization();
                }

                const customizationInfo =
                    await db.ProductCustomizationInfo.findOne(
                        customizations[i].info
                    );

                if (!customizationInfo)
                    return reject({
                        message: "customization info was not found",
                        code: ENTITY_NOT_FOUND,
                    });

                customization.type = customizations[i].type;
                customization.info = customizationInfo;

                const customizationOptionsPromise = [];
                const delCustomizationOptionsPromise = [];

                for (let option of customizations[i].options) {
                    let customizationOption = customization.options?.find(
                        (o) => o.id === option.id
                    );

                    if (!customizationOption)
                        customizationOption =
                            new db.ProductCustomizationOption();

                    customizationOption.name = option.name;

                    if (option.image && customization.type === "card") {
                        const image = await db.MediaLibrary.findOne({
                            id: option.image,
                        });

                        if (image) customizationOption.image = image;
                    }

                    const optionPricesPromsie = [];
                    const delOptionPricesPromsie = [];

                    for (let quantity of productQuantities) {
                        const tmpOptionPrice = option.prices.find(
                            (p) => p.quantity === quantity.quantity
                        );

                        if (tmpOptionPrice) {
                            let optionPrice =
                                await db.ProductCustomizationOptionPrice.findOne(
                                    { id: tmpOptionPrice.id }
                                );

                            if (!optionPrice) {
                                console.log("new");
                                optionPrice =
                                    new db.ProductCustomizationOptionPrice();
                            }

                            optionPrice.price = tmpOptionPrice.price;
                            optionPrice.quantity = quantity;

                            optionPricesPromsie.push(optionPrice.save());
                        }
                    }

                    const customizationOptionPrices = await Promise.all(
                        optionPricesPromsie
                    );

                    customizationOption.prices = customizationOptionPrices;

                    customizationOptionsPromise.push(
                        customizationOption.save()
                    );
                }

                if (customization.options) {
                    for (let option of customization.options) {
                        const foundOption = customizations[i].options.find(
                            (o) => o.id === option.id
                        );

                        if (!foundOption)
                            delCustomizationOptionsPromise.push(
                                option.remove()
                            );
                    }
                }

                const productCustomizationOptions = await Promise.all(
                    customizationOptionsPromise
                );

                customization.options = productCustomizationOptions;

                customizationsPromise.push(customization.save());
            }

            for (let i = 0; i < product.customizations.length; i++) {
                const id = product.customizations[i].id;
                const customization = customizations.find((c) => c.id === id);

                if (!customization) {
                    deleteCustomizationsPromise.push(
                        db.ProductCustomization.remove(
                            product.customizations[i]
                        )
                    );
                }
            }

            const productCustomizations = await Promise.all(
                customizationsPromise
            );

            const productDetails = await Promise.all(detailsPromise);

            if (productCategory) product.category = productCategory;
            product.thumbnail = productThumbnail;
            product.showcase = productShowcase;
            product.name = name;
            product.about = about;
            product.description = description;
            product.ar_name = ar_name;
            product.ar_about = ar_about;
            product.ar_description = ar_description;
            product.sku = sku;
            product.details = productDetails;
            product.quantities = productQuantities;
            product.customizations = productCustomizations;

            await product.save();

            return resolve("you have successfully updated a product.");
        } catch (err) {
            return reject(err);
        }
    });

const deleteProducts = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const products = await db.Product.findByIds(ids);

            await db.Product.remove(products);

            return resolve("you have successfully deleted products.");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getProduct,
    addProduct,
    getProducts,
    editProduct,
    deleteProducts,
};
