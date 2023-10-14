import db from "../entities";
import {
    BlogChangeStatusInput,
    BlogInput,
    BlogOptions,
} from "../graphql/blog/blog.types";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";

const getBlogItem = (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const blog = await db.Blog.findOne(id, {
                relations: ["cover", "gallery"],
            });
            if (!blog)
                return reject({
                    message: "Blog was not found!",
                    code: ENTITY_NOT_FOUND,
                });

            return resolve(blog);
        } catch (err) {
            return reject(err);
        }
    });

const getBlogs = (options: BlogOptions) =>
    new Promise(async (resolve, reject) => {
        try {
            let { search, page, size, isDraft, isPublished } = options;

            let whereType: "where" | "andWhere" = "where";

            page = page || 1;
            size = size || 50;

            const query = db.Blog.createQueryBuilder("blog")
                .leftJoinAndSelect("blog.cover", "cover")
                .leftJoinAndSelect("blog.gallery", "gallery")
                .skip(page * size - size)
                .take(size);

            const where = (text: string) => {
                if (whereType === "where") {
                    whereType = "andWhere";
                    query.where(text);
                }

                query.andWhere(text);
            };

            if (search) {
                where(`blog.title->>'en' ILIKE :title`);
                query.setParameter("title", `%${search}%`);
            }

            if (isDraft || isPublished) {
                where("blog.isDraft = :isDraft");
                query.setParameter("isDraft", isDraft);

                where("blog.isPublished = :isPublished");
                query.setParameter("isPublished", isPublished);
            }

            const [blogs, count] = await query.getManyAndCount();

            return resolve({ blogs, count });
        } catch (err) {
            return reject(err);
        }
    });

const addBlog = (data: BlogInput) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                author,
                title,
                intro,
                textarea,
                cover,
                gallery,
                isDraft,
                isPublished,
            } = data;

            // Cover
            const findCover = await db.MediaLibrary.findOne(cover);
            if (!findCover)
                return reject({
                    message: "Cant find this item/s",
                    code: ENTITY_NOT_FOUND,
                });

            // Gallery
            const findGallery = await db.MediaLibrary.findByIds(gallery);
            if (!findGallery)
                return reject({
                    message: "Cant find this item/s",
                    code: ENTITY_NOT_FOUND,
                });

            const blog = new db.Blog();

            blog.author = author;
            blog.title = title;
            blog.intro = intro;
            blog.textarea = textarea;
            blog.cover = findCover;
            blog.gallery = findGallery;
            blog.isDraft = isDraft;
            blog.isPublished = isPublished;

            await blog.save();

            return resolve("");
        } catch (err) {
            return reject(err);
        }
    });

const editBlog = (id: string, data: BlogInput) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                author,
                title,
                intro,
                textarea,
                cover,
                gallery,
                isDraft,
                isPublished,
            } = data;

            // Cover
            const findCover = await db.MediaLibrary.findOne(cover);
            if (!findCover)
                return reject({
                    message: "Cant find this item/s",
                    code: ENTITY_NOT_FOUND,
                });

            // Gallery
            const findGallery = await db.MediaLibrary.findByIds(gallery);
            if (!findGallery)
                return reject({
                    message: "Cant find this item/s",
                    code: ENTITY_NOT_FOUND,
                });

            const blog = await db.Blog.findOne(id);
            if (!blog)
                return reject({
                    message: "Cant find this blog",
                    code: ENTITY_NOT_FOUND,
                });

            blog.author = author;
            blog.title = title;
            blog.intro = intro;
            blog.textarea = textarea;
            blog.cover = findCover;
            blog.gallery = findGallery;
            blog.isDraft = isDraft;
            blog.isPublished = isPublished;

            await blog.save();

            return resolve("");
        } catch (err) {
            return reject(err);
        }
    });

const changeBlogStatus = (data: BlogChangeStatusInput) =>
    new Promise(async (resolve, reject) => {
        try {
            const { ids, isDraft, isPublished } = data;

            const blogs = await db.Blog.findByIds(ids);
            if (!blogs)
                return reject({
                    message: "Blogs not found!",
                    code: ENTITY_NOT_FOUND,
                });

            const promise: any = [];

            for (let blog of blogs) {
                blog.isDraft = isDraft;
                blog.isPublished = isPublished;

                promise.push(blog);
            }

            await db.Blog.save(promise);

            return resolve("");
        } catch (err) {
            return reject(err);
        }
    });

const deleteBlogs = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            await db.Blog.delete(ids);

            return resolve("");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getBlogs,
    addBlog,
    editBlog,
    changeBlogStatus,
    deleteBlogs,
    getBlogItem,
};
