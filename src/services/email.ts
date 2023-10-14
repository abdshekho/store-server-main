import nodemialer from "nodemailer";
import config from "../config";

export const emailTransporter = nodemialer.createTransport({
    host: config.email.host,
    port: 465,
    secure: true,
    auth: {
        user: config.email.noreply.user,
        pass: config.email.noreply.pass,
    },
});
