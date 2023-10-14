import { createConnection } from "typeorm";
import { entities } from "../entities";
import Config from "../config";

const InitilizeDB = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
        try {
            await createConnection({
                type: "postgres",
                host: Config.db.host,
                port: Config.db.port,
                username: Config.db.user,
                password: Config.db.password,
                database: Config.db.database,
                entities,
                synchronize: true,
                logging: !Config.server.isProduction,
            });

            return resolve(null);
        } catch (err) {
            return reject(err);
        }
    });

export default InitilizeDB;
