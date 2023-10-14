import db from "../entities";
import User from "../entities/user";
import { BAD_USER_INPUT } from "../interfaces/types/graphqlError";

export const getUser = async (
    filter: { id?: string; email?: string; username?: string },
    addFields?: (keyof User)[] | undefined
): Promise<User | undefined> =>
    new Promise(async (resolve, reject) => {
        try {
            let selectOptions: (keyof User)[] | undefined = [
                "id",
                "firstName",
                "lastName",
                "username",
                "email",
                "phone",
            ];

            if (addFields?.length)
                selectOptions = [...selectOptions, ...addFields];

            const user = await db.User.findOne(filter, {
                select: selectOptions,
            });

            return resolve(user);
        } catch (err) {
            return reject(err);
        }
    });

export const updateUser = async (data: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}) =>
    new Promise(async (resolve, reject) => {
        try {
            let { id, firstName, lastName, username, email, phone } = data;

            username = username.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            email = email.trim();
            phone = phone.trim();

            const user = await db.User.findOne({ id });
            if (!user)
                return reject({
                    message: "User not found.",
                    code: BAD_USER_INPUT,
                });

            user.username = username;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.phone = phone;

            await user.save();

            return resolve(user);
        } catch (err) {
            return reject(err);
        }
    });

export default { updateUser, getUser };
