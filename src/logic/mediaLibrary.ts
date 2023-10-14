import db from "../entities";
import MediaLibrary from "../entities/mediaLibrary";
import { MediaLibraryFilesInput } from "../graphql/mediaLibrary/mediaLibrary.types";
import aws from "../utils/aws";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import config from "../config";
import stream from "stream";

export const getMediaLibraryItem = async (
    filter: { id?: string; email?: string; MediaLibraryname?: string },
    addFields?: (keyof MediaLibrary)[] | undefined
): Promise<MediaLibrary | undefined> =>
    new Promise(async (resolve, reject) => {
        try {
            let selectOptions: (keyof MediaLibrary)[] | undefined = ["id"];

            if (addFields?.length)
                selectOptions = [...selectOptions, ...addFields];

            const MediaLibrary = await db.MediaLibrary.findOne(filter, {
                select: selectOptions,
            });

            return resolve(MediaLibrary);
        } catch (err) {
            return reject({ err, status: 500 });
        }
    });

const uploadS3 = (Key: string, ContentType: string) => {
    const pass = new stream.PassThrough();

    const params = aws.s3Params({
        Body: pass,
        Key,
        ContentType,
    });

    return {
        s3Promise: aws.s3.upload(params).promise(),
        writeStream: pass,
    };
};

const uploadDb = (
    type: string,
    description: string,
    s3Key: string,
    dir: string
) => {
    const newmedialibrary = new db.MediaLibrary();

    newmedialibrary.type = type;
    newmedialibrary.description = description;
    newmedialibrary.s3Key = s3Key;
    newmedialibrary.dir = dir;

    return newmedialibrary.save();
};

export const addMediaLibrary = async (
    files: MediaLibraryFilesInput[]
): Promise<MediaLibrary[]> =>
    new Promise(async (resolve, reject) => {
        try {
            const s3Promises = [];
            const dbPromises = [];

            const resizeVerions = [
                {
                    q: 65,
                    w: 340,
                    key: "s",
                },
                {
                    q: 70,
                    w: 640,
                    key: "m",
                },
                {
                    q: 75,
                    w: 1200,
                    key: "l",
                },
            ];

            for (let file of files) {
                const { description, toFormat } = file;
                const fileData = await file.file;
                const imgRegex = /image/gm;
                const isImg = imgRegex.test(fileData.mimetype);
                const key = uuid();
                let format = "";
                let mimetype = "";
                let filename = "";

                const date = new Date();

                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                const dir = `${year}/${month}/`;

                if (isImg) {
                    if (toFormat && toFormat !== "none") {
                        format = toFormat;
                        mimetype = `image/${toFormat}`;
                    } else {
                        const tmpFormat = fileData.mimetype.split("/")[1];

                        if (tmpFormat === "svg+xml") {
                            format = "svg";
                            mimetype = `image/svg+xml`;
                        } else {
                            format = tmpFormat;
                            mimetype = `image/${tmpFormat}`;
                        }
                    }
                } else {
                    format = fileData.mimetype.split("/")[1];
                    mimetype = fileData.mimetype;
                }

                filename = key + "." + format;

                if (isImg) {
                    if (format === "svg") {
                        const stream = fileData.createReadStream();

                        const { writeStream, s3Promise } = uploadS3(
                            dir + filename,
                            mimetype
                        );

                        stream.pipe(writeStream);

                        s3Promises.push(s3Promise);
                    } else {
                        for (let { key, q, w } of resizeVerions) {
                            const stream = fileData.createReadStream();

                            const sharpImg = stream.pipe(
                                sharp()
                                    .resize(w)
                                    .toFormat(format as any, {
                                        quality: q,
                                        lossless: true,
                                        mozjpeg: format === "jpeg",
                                    })
                            );

                            const { writeStream, s3Promise } = uploadS3(
                                dir + key + "-" + filename,
                                mimetype
                            );

                            sharpImg.pipe(writeStream);

                            s3Promises.push(s3Promise);
                        }
                    }
                } else {
                    const stream = fileData.createReadStream();

                    const { writeStream, s3Promise } = uploadS3(
                        dir + filename,
                        mimetype
                    );

                    stream.pipe(writeStream);

                    s3Promises.push(s3Promise);
                }

                dbPromises.push(uploadDb(mimetype, description, filename, dir));
            }

            await Promise.all(s3Promises);
            const mediaLibraryItems = await Promise.all(dbPromises);

            return resolve(mediaLibraryItems);
        } catch (err) {
            return reject({ message: err, status: 500 });
        }
    });

export const deleteMediaLibrary = async (ids: string[]): Promise<void> =>
    new Promise(async (resolve, reject) => {
        try {
            const toDeleteIds: string[] = [];
            const objects: { Key: string }[] = [];
            const resizeSizes = ["s-", "m-", "l-"];
            const imgRegex = /image/gm;

            const mediaLibraryList = await db.MediaLibrary.createQueryBuilder(
                "media_library"
            )
                .where("media_library.id IN (:...ids)")
                .setParameters({ ids })
                .getMany();

            for (let i = 0; i < mediaLibraryList.length; i++) {
                const { type, dir, s3Key, id } = mediaLibraryList[i];
                const isImg = imgRegex.test(type);

                if (isImg && type !== "image/svg+xml") {
                    for (let size of resizeSizes) {
                        objects.push({ Key: dir + size + s3Key });
                    }
                }

                objects.push({ Key: dir + s3Key });
                toDeleteIds.push(id);
            }

            await db.MediaLibrary.delete(toDeleteIds);

            await aws.s3
                .deleteObjects({
                    Bucket: config.aws.bucket.name,
                    Delete: { Objects: objects },
                })
                .promise();

            return resolve();
        } catch (err) {
            return reject({ message: err, status: 500 });
        }
    });

export default {
    getMediaLibraryItem,
    addMediaLibrary,
    deleteMediaLibrary,
};
