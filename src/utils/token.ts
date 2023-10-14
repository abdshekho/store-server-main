import jwt from "jsonwebtoken";
import Config from "../config";

export const generateToken = (data: any) => {
    const token = jwt.sign(data, Config.server.jwtSecret);

    return token;
};

export const verifyToken = (token: string): any => {
    const payload = jwt.verify(token, Config.server.jwtSecret);

    return payload;
};
