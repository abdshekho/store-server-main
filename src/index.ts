require("dotenv").config();

import "reflect-metadata";
import express from "express";
import Config from "./config";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import InitilizeDB from "./services/db";
import { isAuth } from "./middlewares/auth";
import { graphqlUploadExpress } from "graphql-upload";
import compression from "compression";
import { resolvers } from "./graphql";
import db from "./entities";
import config from "./config";
import AwsS3 from "./utils/aws";

const main = async () => {
    const app = express();
    app.disable("x-powered-by");
    app.use(
        compression({
            level: 6,
            filter: (req, res) => {
                if (req.headers["x-no-compression"]) {
                    return false;
                }

                return compression.filter(req, res);
            },
        })
    );
    app.use(
        cors({
            origin: function (origin, callback) {
                callback(null, true);
            },
        })
    );
    app.use(isAuth);
    app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 100 }));

    await InitilizeDB();

    app.get("/downloadImage/:fileKey", async (req, res) => {
        var fileKey = req.params.fileKey;

        var bucketParams = {
            Bucket: config.aws.bucket.name,
            Key: fileKey,
        };

        await AwsS3.s3.getObject(bucketParams, (err, data) => {
            res.send(data.Body);
        });
    });

    // start ---------- server checks
    let formSettings = await db.FormSettings.findOne();

    if (!formSettings) {
        formSettings = new db.FormSettings();

        formSettings.title = "";
        formSettings.description = "";

        await formSettings.save();
    }
    // ---------
    let emailSettings = await db.EmailSettings.findOne();

    if (!emailSettings) {
        emailSettings = new db.EmailSettings();

        emailSettings.title = "";
        emailSettings.description = "";

        await emailSettings.save();
    }
    // end ---------- server checks

    const apolloServer = new ApolloServer({
        uploads: false,
        schema: await buildSchema({
            resolvers,
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(Config.server.port, () =>
        console.log(
            `🚀 Server ready at ${Config.server.apiUrl}${apolloServer.graphqlPath}`
        )
    );
};

main().catch((e) => console.log(e));
