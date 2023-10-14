import db from "../entities";
import validate from "../validators";
import argon2 from "argon2";
import User from "../entities/user";
import { getUser } from "./user";
import { BAD_USER_INPUT } from "../interfaces/types/graphqlError";

const createUser = async (data: any) =>
    new Promise(async (resolve, reject) => {
        try {
            let { firstName, lastName, email, phone, username, password } =
                data;

            firstName = firstName.trim();
            lastName = lastName.trim();
            phone = phone.trim();
            username = username.trim();
            email = email.trim().toLowerCase();

            const errors: {
                firstName: string[];
                lastName: string[];
                email: string[];
                phone: string[];
                username: string[];
                password: string[];
            } = {
                firstName: [],
                lastName: [],
                email: [],
                phone: [],
                username: [],
                password: [],
            };

            if (validate.email.isValid(email)) {
                errors.email.push("Please enter a valid email address.");
            } else {
                const e = await db.User.findOne({ email });
                if (e) errors.email.push("this email is in use.");
            }

            const u = await db.User.findOne({ username });
            if (u) errors.username.push("this username is in use.");

            const p = await db.User.findOne({ phone });
            if (p) errors.phone.push("this phone is in use.");

            for (let v of Object.values(errors))
                if (v.length) return reject(errors);

            const hashedPassword = await argon2.hash(password);

            await db.User.insert({
                firstName,
                lastName,
                email,
                phone,
                username,
                password: hashedPassword,
            });

            return resolve({
                firstName,
                lastName,
                email,
                phone,
                username,
            });
        } catch (err) {
            return reject(err);
        }
    });

const signin = async (data: any) =>
    new Promise(async (resolve, reject) => {
        try {
            let { identifier, password } = data;

            identifier = identifier.trim();
            password = password.trim();

            let user: User | undefined = await getUser(
                {
                    username: identifier,
                },
                ["password"]
            );
            if (!user)
                user = await getUser({ email: identifier }, ["password"]);
            if (!user)
                return reject({
                    message: "No user with this info.",
                    code: BAD_USER_INPUT,
                });

            const hashedPassword = await argon2.verify(user.password, password);

            if (!hashedPassword)
                return reject({
                    message: "No user with this info.",
                    code: BAD_USER_INPUT,
                });

            return resolve(user);
        } catch (err) {
            return reject(err);
        }
    });

export default { createUser, signin };
