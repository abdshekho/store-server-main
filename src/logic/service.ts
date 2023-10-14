import logic from ".";
import db from "../entities";
import {
    GetServiceFilters,
    ReorderServicesData,
} from "../graphql/service/service.types";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";

const getServices = (filters: GetServiceFilters) =>
    new Promise(async (resolve, reject) => {
        try {
            let { page, size, search, ids, parent } = filters;

            let whereType: "where" | "andWhere" = "where";

            const query = db.Service.createQueryBuilder("service")
                .leftJoinAndSelect("service.cover", "cover")
                .leftJoinAndSelect("service.banner", "banner")
                .leftJoinAndSelect("service.gallery", "gallery")
                .leftJoinAndSelect("service.parent", "parent")
                .orderBy("service.order", "ASC");

            const where = (text: string) => {
                if (whereType === "where") {
                    whereType = "andWhere";
                    query.where(text);
                }

                query.andWhere(text);
            };

            if (page && size) {
                query.skip(page * size - size).take(size);
            }

            if (ids) {
                where("service.id IN (:...ids)");
                query.setParameter("ids", ids);

                whereType = "andWhere";
            }

            if (parent === "") {
                where("service.parent IS NULL");
            } else if (parent) {
                where("service.parent = :parent");
                query.setParameter("parent", parent);
            }

            const [services, count] = await query.getManyAndCount();

            return resolve({ services, count });
        } catch (err) {
            return reject(err);
        }
    });

const getServiceItem = (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const service = await db.Service.findOne(id, {
                relations: ["cover", "banner", "gallery", "parent"],
            });

            if (!service)
                return reject({
                    message: "service not found",
                    code: ENTITY_NOT_FOUND,
                });

            const children = await db.Service.find({
                where: { parent: service?.id },
                relations: ["cover", "banner", "gallery"],
            });

            service.children = children;

            return resolve(service);
        } catch (err) {
            return reject(err);
        }
    });

interface AddProps {
    title: string;
    sub_title: string;
    description: string;
    ar_title: string;
    ar_sub_title: string;
    ar_description: string;
    cover: string;
    banner: string;
    gallery: string[];
    parent: string;
}

const addService = (data: AddProps) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                title,
                sub_title,
                description,
                ar_title,
                ar_sub_title,
                ar_description,
                cover,
                banner,
                gallery,
                parent,
            } = data;

            const GetCover = await db.MediaLibrary.findOne(cover);
            const GetBanner = await db.MediaLibrary.findOne(banner);
            const GetGallery = await db.MediaLibrary.findByIds(gallery);

            if (!GetCover || !GetBanner || !GetGallery)
                return reject({
                    message: "banner or cover or gallery ids is not found",
                    code: ENTITY_NOT_FOUND,
                });

            const parentService = await db.Service.findOne({
                id: parent,
            });

            const service = new db.Service();

            if (parentService) service.parent = parentService;
            service.title = title;
            service.sub_title = sub_title;
            service.description = description;
            service.ar_title = ar_title;
            service.ar_sub_title = ar_sub_title;
            service.ar_description = ar_description;
            service.cover = GetCover;
            service.banner = GetBanner;
            service.gallery = GetGallery;

            await service.save();

            return resolve(service);
        } catch (err) {
            return reject(err);
        }
    });

const editService = (data: AddProps, id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                title,
                sub_title,
                description,
                ar_title,
                ar_sub_title,
                ar_description,
                cover,
                banner,
                gallery,
                parent,
            } = data;

            // Get Service
            const service = await db.Service.findOne(id);
            if (!service)
                return reject({
                    message: "Service not found!",
                    code: ENTITY_NOT_FOUND,
                });

            // Get Media
            const GetCover = await db.MediaLibrary.findOne(cover);
            const GetBanner = await db.MediaLibrary.findOne(banner);
            const GetGallery = await db.MediaLibrary.findByIds(gallery);

            if (!GetCover || !GetBanner || !GetGallery)
                return reject({
                    message: "banner or cover or gallery ids is not found",
                    code: ENTITY_NOT_FOUND,
                });

            const parentService = await db.Service.findOne({
                id: parent,
            });

            if (parentService) service.parent = parentService;
            service.title = title;
            service.sub_title = sub_title;
            service.description = description;
            service.ar_title = ar_title;
            service.ar_sub_title = ar_sub_title;
            service.ar_description = ar_description;
            service.cover = GetCover;
            service.banner = GetBanner;
            service.gallery = GetGallery;

            await service.save();

            // Update Dynamic Content
            logic.DynamicContent.updateContentList("services", service.id);

            return resolve(service);
        } catch (err) {
            return reject(err);
        }
    });

const deleteServices = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            for (let id of ids) {
                logic.DynamicContent.updateContentList("services", id);
            }

            await db.Service.delete(ids);

            return resolve("You have successfully deleted a service item/s");
        } catch (err) {
            return reject(err);
        }
    });

const reorderServices = (data: ReorderServicesData[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const promises = [];
            const services = await db.Service.findByIds(data, {
                select: ["id"],
            });

            for (let i = 0; i < data.length; i++) {
                const service = services.find((s) => s.id === data[i].id);

                if (!service) continue;
                service.order = i;

                await logic.DynamicContent.updateContentList(
                    "services",
                    service.id
                );

                promises.push(service.save());
            }

            await Promise.all(promises);

            return resolve("you have successfully reorded services");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    addService,
    getServices,
    getServiceItem,
    deleteServices,
    editService,
    reorderServices,
};
