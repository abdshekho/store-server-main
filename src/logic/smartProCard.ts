import { FileUpload } from "graphql-upload";
import logic from ".";
import db from "../entities";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";

const getSmartProCardItem = async (id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const smartProCard = await db.SmartProCard.findOne(id, {
                relations: ["frontCard", "backCard"],
            });
            if (!smartProCard)
                return reject({
                    message: "smartProCards was not found!",
                    code: ENTITY_NOT_FOUND,
                });

            return resolve(smartProCard);
        } catch (err) {
            return reject(err);
        }
    });

interface IFilters {
    ids?: string[];
    page?: number;
    size?: number;
    search?: string;
}

const getSmartProCards = async (filters: IFilters) =>
    new Promise(async (resolve, reject) => {
        try {
            let { page, size, search, ids } = filters;

            let whereType: "where" | "andWhere" = "where";

            const query = db.SmartProCard.createQueryBuilder("smartProCard")
                .leftJoinAndSelect("smartProCard.frontCard", "frontCard")
                .leftJoinAndSelect("smartProCard.backCard", "backCard");

            if (page && size) {
                query.skip(page * size - size).take(size);
            }

            if (ids) {
                query.where("smartProCard.id IN (:...ids)");
                query.setParameter("ids", ids);

                whereType = "andWhere";
            }

            if (search) {
                query[whereType](
                    `smartProCard.username ILIKE :search`
                ).setParameter("search", `%${search}%`);
            }

            const [smartProCards, count] = await query.getManyAndCount();

            return resolve({ smartProCards, count });
        } catch (err) {
            return reject(err);
        }
    });

interface SmartProCardProps {
    username: string;
    phone: string;
    tier: string;
    serialNumber?: string;
    frontCard?: string;
}

const addSmartProCards = async (data: SmartProCardProps[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const smartCards: any = [];

            for (let card of data) {
                const cardPromise: any = {};

                // Front Card
                if (card.frontCard) {
                    const findFrontCard = await db.MediaLibrary.findOne(
                        card.frontCard
                    );
                    if (!findFrontCard)
                        return reject({
                            message: "Front Card was not found!",
                            code: ENTITY_NOT_FOUND,
                        });
                    cardPromise.frontCard = findFrontCard;

                    // Back Card
                    const findBackCard = await db.MediaLibrary.findOne({
                        where: { description: "Smart-Pro-Card-Gold" },
                    });
                    if (!findBackCard)
                        return reject({
                            message: "Back Card was not found!",
                            code: ENTITY_NOT_FOUND,
                        });
                    cardPromise.backCard = findBackCard;
                }

                if (card.serialNumber) {
                    cardPromise.serialNumber = card.serialNumber;
                } else {
                    var minm = 1000000000000000;
                    var maxm = 9999999999999999;
                    let math = (
                        Math.floor(Math.random() * (maxm - minm + 1)) + minm
                    )
                        .toString()
                        .split("");

                    const items = Array.from(math);

                    for (let i = 0; i < 16; i++) {
                        if (i == 4 || i == 9 || i == 14)
                            items.splice(i, 0, "-");
                    }

                    let serialNumber: string = "";

                    for (let i = 0; i < items.length; i++) {
                        serialNumber = serialNumber + items[i];
                    }

                    cardPromise.serialNumber = serialNumber;
                }

                cardPromise.username = card.username;
                cardPromise.phone = card.phone;
                cardPromise.tier = card.tier;
                smartCards.push(cardPromise);
            }

            if (smartCards) await db.SmartProCard.insert(smartCards);

            return resolve("You have successfully add new SmartProCard/s");
        } catch (err) {
            return reject(err);
        }
    });

interface EditSmartProCardProps {
    username?: string;
    phone?: string;
    tier?: string;
    serialNumber?: string;
    frontCard?: string;
    file?: FileUpload;
}

const editSmartProCard = async (data: EditSmartProCardProps, id: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const { username, phone, tier, serialNumber, frontCard, file } =
                data;
            const card = await db.SmartProCard.findOne(id);

            if (!card)
                return reject({
                    message: "SmartCard was not found!",
                    code: ENTITY_NOT_FOUND,
                });

            // Front Card
            if (frontCard) {
                const findFrontCard = await db.MediaLibrary.findOne({
                    id: frontCard,
                });
                if (!findFrontCard)
                    return reject({
                        message: "Front Card was not found!",
                        code: ENTITY_NOT_FOUND,
                    });
                card.frontCard = findFrontCard;
            }

            if (username) card.username = username;
            if (phone) card.phone = phone;
            if (tier) card.tier = tier;
            if (serialNumber) card.serialNumber = serialNumber;

            if (file) {
                const [cardImage] = await logic.MediaLibrary.addMediaLibrary([
                    {
                        file,
                        toFormat: "jpeg",
                        description: "SmartProCard-" + card.username,
                    },
                ]);

                if (cardImage) card.frontCard = cardImage;

                // Back Card
                const findBackCard = await db.MediaLibrary.findOne({
                    description: `Smart-Pro-Card-Gold`,
                });

                if (!findBackCard)
                    return reject({
                        message: "Back Card was not found!",
                        code: ENTITY_NOT_FOUND,
                    });
                card.backCard = findBackCard;
            }

            await card.save();

            return resolve("You have successfully edit new SmartProCard/s");
        } catch (err) {
            return reject(err);
        }
    });

const deleteSmartProCards = async (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            await db.SmartProCard.delete(ids);

            return resolve("You have successfully deleted selected item/s");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getSmartProCards,
    deleteSmartProCards,
    addSmartProCards,
    getSmartProCardItem,
    editSmartProCard,
};
