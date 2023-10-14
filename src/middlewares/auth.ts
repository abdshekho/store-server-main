import { Request, Response, NextFunction } from "express";
import logic from "../logic";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | null = null;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    // logic.User.getUser({ id });

    next();
};
