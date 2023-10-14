import logic from ".";
import db from "../entities";
import { GetProjectFilters } from "../graphql/project/project.types";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";

const getProjects = (filters?: GetProjectFilters) =>
    new Promise(async (resolve, reject) => {
        try {
            let { page, size, parent } = filters || {};

            const query = db.Project.createQueryBuilder("project")
                .leftJoinAndSelect("project.cover", "cover")
                .leftJoinAndSelect("project.gallery", "gallery")
                .leftJoinAndSelect("project.banner", "banner")
                .orderBy("project.order", "ASC");

            if (page && size) {
                query.skip(page * size - size).take(size);
            }

            if (parent === "") {
                query.where("project.parent IS NULL");
            } else if (parent) {
                query.where("project.parent = :parent");
                query.setParameter("parent", parent);
            }

            const [projects, count] = await query.getManyAndCount();

            return resolve({ projects, count });
        } catch (err) {
            return reject(err);
        }
    });

const getProjectItem = (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            console.log(id, "\n");
            const project = await db.Project.findOne(
                { id },
                {
                    relations: [
                        "cover",
                        "banner",
                        "gallery",
                        "parent",
                        "children",
                        "children.cover",
                    ],
                }
            );

            return resolve(project);
        } catch (err) {
            return reject(err);
        }
    });

interface AddProps {
    client: string;
    title: string;
    description: string;
    ar_client: string;
    ar_title: string;
    ar_description: string;
    location: string;
    cover: string;
    banner: string;
    gallery: string[];
    parent: string;
}

const addProject = (data: AddProps) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                title,
                client,
                description,
                ar_title,
                ar_client,
                ar_description,
                location,
                cover,
                banner,
                gallery,
                parent,
            } = data;

            // Get Media
            const GetCover = await db.MediaLibrary.findOne(cover);
            const GetBanner = await db.MediaLibrary.findOne(banner);
            const GetGallery = await db.MediaLibrary.findByIds(gallery);
            let parentProject;

            if (parent)
                parentProject = await db.Project.findOne({ id: parent });

            if (!GetCover || !GetBanner || !GetGallery)
                return reject({
                    message: "banner or cover or gallery ids is not found",
                    code: ENTITY_NOT_FOUND,
                });

            const project = new db.Project();

            project.client = client;
            project.title = title;
            project.description = description;
            project.ar_client = ar_client;
            project.ar_title = ar_title;
            project.ar_description = ar_description;
            project.location = location;
            project.cover = GetCover;
            project.banner = GetBanner;
            project.gallery = GetGallery;
            if (parentProject) project.parent = parentProject;

            await project.save();

            return resolve(project);
        } catch (err) {
            return reject(err);
        }
    });

const editProject = (data: AddProps, id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            let {
                title,
                client,
                description,
                ar_title,
                ar_client,
                ar_description,
                location,
                cover,
                banner,
                gallery,
                parent,
            } = data;

            // Get Project
            const project = await db.Project.findOne(id);
            if (!project)
                return reject({
                    message: "Project not found!",
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

            let parentProject;

            if (parent)
                parentProject = await db.Project.findOne({ id: parent });

            project.client = client;
            project.title = title;
            project.description = description;
            project.ar_client = ar_client;
            project.ar_title = ar_title;
            project.ar_description = ar_description;
            project.location = location;
            project.cover = GetCover;
            project.banner = GetBanner;
            project.gallery = GetGallery;
            if (parentProject) project.parent = parentProject;

            await project.save();

            // Update Dynamic Content
            logic.DynamicContent.updateContentList("projects", project.id);

            return resolve(project);
        } catch (err) {
            return reject(err);
        }
    });

const deleteProjects = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            for (let id of ids) {
                // Update Dynamic Content
                logic.DynamicContent.updateContentList("services", id);
            }

            await db.Project.delete(ids);

            return resolve("You have successfully deleted a project item/s");
        } catch (err) {
            return reject(err);
        }
    });

export const reorderProjects = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const projects = await db.Project.findByIds(ids);

            const projectsPromise = [];

            for (let i = 0; i < ids.length; i++) {
                const foundProject = projects.find((p) => p.id === ids[i]);

                if (!foundProject) continue;

                foundProject.order = i;

                projectsPromise.push(foundProject.save());
            }

            await Promise.all(projectsPromise);

            return resolve("you have successfully reordered projects.");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    addProject,
    getProjects,
    getProjectItem,
    deleteProjects,
    editProject,
    reorderProjects,
};
