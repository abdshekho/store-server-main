import sharp from "sharp";
import config from "../config";
import db from "../entities";
import Form from "../entities/form";
import {
    FormData,
    GetFormsOptions,
    SubmitFormData,
} from "../graphql/form/form.types";
import { ENTITY_NOT_FOUND } from "../interfaces/types/graphqlError";
import { emailTransporter } from "../services/email";

const getForm = (id: string): Promise<Form | undefined> =>
    new Promise(async (resolve, reject) => {
        try {
            const form = await db.Form.createQueryBuilder("form")
                .leftJoinAndSelect("form.image", "image")
                .leftJoinAndSelect("form.banner", "banner")
                .leftJoinAndSelect("form.endScreen", "endScreen")
                .leftJoinAndSelect("form.bookings", "bookings")
                .leftJoinAndSelect("endScreen.image", "endScreenImage")
                .leftJoinAndSelect("form.sections", "sections")
                .leftJoinAndSelect("sections.image", "section_image")
                .leftJoinAndSelect("sections.inputs", "inputs")
                .leftJoinAndSelect("inputs.options", "options")
                .leftJoinAndSelect("options.image", "option_image")
                .orderBy("sections.order", "ASC")
                .addOrderBy("inputs.order", "ASC")
                .addOrderBy("options.order", "ASC")
                .where("form.id = :id", { id })
                .getOne();

            return resolve(form);
        } catch (err) {
            return reject(err);
        }
    });

const getForms = (options: GetFormsOptions) =>
    new Promise(async (resolve, reject) => {
        try {
            const { isHidden, size, page } = options;

            const query = db.Form.createQueryBuilder("form")
                .leftJoinAndSelect("form.image", "image")
                .leftJoinAndSelect("form.sections", "sections")
                .leftJoinAndSelect("sections.image", "section_image")
                .leftJoinAndSelect("sections.inputs", "inputs")
                .leftJoinAndSelect("inputs.options", "options")
                .leftJoinAndSelect("options.image", "option_image")
                .orderBy("form.order", "ASC")
                .addOrderBy("inputs.order", "ASC")
                .addOrderBy("sections.order", "ASC");

            if (isHidden !== undefined) {
                query.where("form.isHidden = :isHidden");
                query.setParameter("isHidden", isHidden);
            }

            // if (size && page) {
            //     console.log(size, page)
            //     query.skip(page * size - size).take(size);
            // }

            const [forms, count] = await query.getManyAndCount();

            return resolve({ forms, count });
        } catch (err) {
            return reject(err);
        }
    });

const addForm = (data: FormData) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                image,
                name,
                description,
                ar_name,
                ar_description,
                sections,
                banner,
                isHidden,
                isSmartProCard,
                isEndScreen,
                endScreen,
            } = data;

            const form = new db.Form();

            const sectionsPromise = [];

            for (let section of sections) {
                const formSection = new db.FormSection();

                const inputPromise = [];

                for (let input of section.inputs) {
                    const formInput = new db.FormInput();

                    const optionPromise = [];

                    for (
                        let iOption = 0;
                        iOption < input.options.length;
                        iOption++
                    ) {
                        const option = input.options[iOption];
                        const inputOption = new db.InputOption();

                        if (input.type !== "text") {
                            const optionImage = await db.MediaLibrary.findOne({
                                id: option.image,
                            });

                            if (optionImage) inputOption.image = optionImage;
                            inputOption.price = option.price;
                        }

                        inputOption.value = option.value;
                        inputOption.description = option.description;
                        inputOption.ar_value = option.ar_value;
                        inputOption.ar_description = option.ar_description;
                        inputOption.price = option.price;
                        inputOption.toSection = option.toSection;
                        inputOption.parentOption = option.parentOption;
                        inputOption.isOther = option.isOther;
                        inputOption.isQty = option.isQty;
                        inputOption.operationType = option.operationType;
                        inputOption.order = iOption;

                        optionPromise.push(inputOption.save());
                    }

                    const inputOptions = await Promise.all(optionPromise);

                    formInput.label = input.label;
                    formInput.ar_label = input.ar_label;
                    formInput.type = input.type;
                    if (input.textType) formInput.textType = input.textType;
                    formInput.isRequired = input.isRequired;
                    formInput.isConditional = input.isConditional;
                    formInput.isParent = input.isParent;
                    formInput.isQty = input.isQty;
                    formInput.toSection = input.toSection;
                    formInput.parentInput = input.parentInput;
                    formInput.order = section.inputs.indexOf(input);
                    formInput.options = inputOptions;

                    inputPromise.push(formInput.save());
                }

                const sectionImage = await db.MediaLibrary.findOne({
                    id: section.image,
                });

                const formInputs = await Promise.all(inputPromise);

                if (sectionImage) formSection.image = sectionImage;
                formSection.title = section.title;
                formSection.description = section.description;
                formSection.ar_title = section.ar_title;
                formSection.ar_description = section.ar_description;
                formSection.order = sections.indexOf(section);
                formSection.inputs = formInputs;

                sectionsPromise.push(formSection.save());
            }

            // end screen
            if (endScreen) {
                const formEndScreen = new db.FormEndScreen();

                const foundImage = await db.MediaLibrary.findOne({
                    id: endScreen.image,
                });

                if (foundImage) formEndScreen.image = foundImage;
                formEndScreen.title = endScreen.title;
                formEndScreen.description = endScreen.description;
                formEndScreen.ar_title = endScreen.ar_title;
                formEndScreen.ar_description = endScreen.ar_description;

                await formEndScreen.save();

                form.endScreen = formEndScreen;
            }

            const formImage = await db.MediaLibrary.findOne({ id: image });
            const formBanner = await db.MediaLibrary.findOne({ id: banner });

            const formSections = await Promise.all(sectionsPromise);

            if (formImage) form.image = formImage;
            if (formBanner) form.banner = formBanner;
            form.name = name;
            form.description = description;
            form.ar_name = ar_name;
            form.ar_description = ar_description;
            form.isHidden = isHidden;
            form.isEndScreen = isEndScreen;
            form.isSmartProCard = isSmartProCard;
            form.sections = formSections;

            await form.save();

            return resolve(form);
        } catch (err) {
            return reject(err);
        }
    });

const editForm = (id: string, data: FormData) =>
    new Promise(async (resolve, reject) => {
        try {
            const {
                name,
                description,
                ar_name,
                ar_description,
                sections,
                image,
                isHidden,
                isEndScreen,
                isSmartProCard,
                banner,
                endScreen,
            } = data;

            const form = await getForm(id);

            if (!form)
                return reject({
                    message: "form was not found",
                    code: ENTITY_NOT_FOUND,
                });

            // sections
            const sectionsPromise = [];
            const delSectionsPromise = [];

            for (let section of form.sections) {
                const foundSection = sections.find((s) => s.id === section.id);

                if (!foundSection) delSectionsPromise.push(section.remove());
            }

            for (let section of sections) {
                const dbSection = form.sections.find(
                    (s) => s.id === section.id
                );
                let foundSection = await db.FormSection.findOne({
                    id: section.id,
                });

                if (!foundSection) foundSection = new db.FormSection();

                // inputs
                const inputsPromise = [];
                const delInputsPromise = [];

                if (dbSection?.inputs && foundSection.inputs) {
                    for (let input of dbSection.inputs) {
                        const foundInput = foundSection.inputs.find(
                            (i) => i.id === input.id
                        );

                        if (!foundInput) delInputsPromise.push(input.remove());
                    }
                }

                for (let input of section.inputs) {
                    const dbInput = dbSection?.inputs?.find(
                        (i) => i.id === input.id
                    );
                    let foundInput = await db.FormInput.findOne({
                        id: input.id,
                    });

                    if (!foundInput) foundInput = new db.FormInput();

                    const optionsPromise = [];
                    const delOptionsPromise = [];

                    if (dbInput?.options && foundInput.options) {
                        for (let option of dbInput.options) {
                            const foundOption = foundInput.options.find(
                                (o) => o.id === option.id
                            );

                            if (!foundOption)
                                delOptionsPromise.push(foundOption);
                        }
                    }

                    for (
                        let iOption = 0;
                        iOption < input.options.length;
                        iOption++
                    ) {
                        const option = input.options[iOption];
                        let foundOption = await db.InputOption.findOne({
                            id: option.id,
                        });

                        if (!foundOption) foundOption = new db.InputOption();

                        const optionImage = await db.MediaLibrary.findOne({
                            id: option.image,
                        });

                        if (optionImage) foundOption.image = optionImage;
                        foundOption.value = option.value;
                        foundOption.description = option.description;
                        foundOption.ar_value = option.ar_value;
                        foundOption.ar_description = option.ar_description;
                        foundOption.price = option.price;
                        foundOption.toSection = option.toSection;
                        foundOption.parentOption = option.parentOption;
                        foundOption.isOther = option.isOther;
                        foundOption.isQty = option.isQty;
                        foundOption.operationType = option.operationType;
                        foundOption.order = iOption;

                        optionsPromise.push(foundOption.save());
                    }

                    const inputOptions = await Promise.all(optionsPromise);
                    await Promise.all(delOptionsPromise);

                    foundInput.label = input.label;
                    foundInput.ar_label = input.ar_label;
                    foundInput.type = input.type;
                    if (input.textType) foundInput.textType = input.textType;
                    foundInput.isConditional = input.isConditional;
                    foundInput.isParent = input.isParent;
                    foundInput.isRequired = input.isRequired;
                    foundInput.isQty = input.isQty;
                    foundInput.toSection = input.toSection;
                    foundInput.parentInput = input.parentInput;
                    foundInput.order = section.inputs.indexOf(input);
                    foundInput.options = inputOptions;

                    inputsPromise.push(foundInput.save());
                }

                const sectionImage = await db.MediaLibrary.findOne({
                    id: section.image,
                });

                const sectionInputs = await Promise.all(inputsPromise);
                await Promise.all(delInputsPromise);

                if (sectionImage) foundSection.image = sectionImage;
                foundSection.title = section.title;
                foundSection.description = section.description;
                foundSection.ar_title = section.ar_title;
                foundSection.ar_description = section.ar_description;
                foundSection.order = sections.indexOf(section);
                foundSection.inputs = sectionInputs;

                sectionsPromise.push(foundSection.save());
            }

            const formSections = await Promise.all(sectionsPromise);
            await Promise.all(delSectionsPromise);

            const formImg = await db.MediaLibrary.findOne({ id: image });
            const formBanner = await db.MediaLibrary.findOne({ id: banner });

            let es;

            // end screen
            if (endScreen) {
                let formEndScreen = await db.FormEndScreen.findOne({
                    id: endScreen.id,
                });
                if (!formEndScreen) formEndScreen = new db.FormEndScreen();
                const foundImage = await db.MediaLibrary.findOne({
                    id: endScreen.image,
                });

                if (foundImage) formEndScreen.image = foundImage;
                formEndScreen.title = endScreen.title;
                formEndScreen.description = endScreen.description;
                formEndScreen.ar_title = endScreen.ar_title;
                formEndScreen.ar_description = endScreen.ar_description;

                await formEndScreen.save();

                form.endScreen = formEndScreen;
            } else if (form.endScreen && !endScreen) {
                es = form.endScreen;
                form.endScreen = null;
            }

            if (formImg) form.image = formImg;
            if (formBanner) form.banner = formBanner;
            form.name = name;
            form.description = description;
            form.ar_name = ar_name;
            form.ar_description = ar_description;
            form.isHidden = isHidden;
            form.isEndScreen = isEndScreen;
            form.isSmartProCard = isSmartProCard;
            form.sections = formSections;

            await form.save();
            await es?.remove();

            return resolve(form);
        } catch (err) {
            return reject(err);
        }
    });

const deleteForm = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const forms = await db.Form.findByIds(ids);

            await db.Form.remove(forms);

            return resolve("you have successfully deleted forms");
        } catch (err) {
            return reject(err);
        }
    });

const reorderForms = (ids: string[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const forms = await db.Form.findByIds(ids);

            const formsPromise = [];

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const foundForm = forms.find((f) => f.id === id);

                if (!foundForm) continue;

                foundForm.order = i + 1;

                formsPromise.push(foundForm.save());
            }

            await Promise.all(formsPromise);

            return resolve("you have successfully reordered the forms");
        } catch (err) {
            return reject(err);
        }
    });

export const submitForm = (data: SubmitFormData) =>
    new Promise(async (resolve, reject) => {
        try {
            const { id, date, email, sendToEmail, inputs, totalPrice } = data;

            const form = await db.Form.findOne(
                { id },
                { relations: ["bookings"] }
            );

            if (!form) return reject("form was not found.");

            if (date) {
                const newBooking = new db.Booking();

                newBooking.date = new Date(date);

                await newBooking.save();

                form.bookings.push(newBooking);
            }

            await form.save();

            let emails = [config.email.noreply.user, email, sendToEmail];

            emails = emails.filter((e) => !!e);

            const html = `
                <div style="width: 100%;">
                    <div style="margin-bottom: 10px; border-bottom: 1px solid gray;">
                        <img src="https://dabfvz03xqi3x.cloudfront.net/2021/10/m-11643003-b7f5-4db8-8ffd-9a93ab398ad4.jpeg" style="width: 1700x; height: 94px" alt="logo" />
                        <h1>SmartFamily</h1>
                    </div>
                    ${inputs.map(
                        (input, i) => `
                        <div style="display: flex; justify-content: space-between; width: 100%; ${
                            inputs.length - 1 === i
                                ? ""
                                : "border-bottom: 1px solid gray;"
                        }">
                            <div>
                                <p style="font-size: 18px;">
                                    <span style="font-weight: bold; text-transform: capitalize;">${
                                        input.label
                                    }: </span>${input.value}
                                </P>
                            </div>
                            <div style="margin-left: auto;">
                                <p style="font-size: 18px;">
                                ${
                                    input.price > 0
                                        ? `+` + input.price + `AED`
                                        : ""
                                }
                                </p>
                            </div>
                        </div>
                    `
                    )}
                    <div style="display: flex; width: 100%; border-top: 1px solid black;">
                        <div style="margin-left: auto;">
                            <p style="font-size: 18px;"><span style="font-weight: bold; text-transform: capitalize;">Total Price:</span> ${totalPrice}AED</p>        
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <a href="https://crownphoenixadv.com/">
                            <img src="https://media-exp1.licdn.com/dms/image/C4D0BAQEPKrWIzWikvg/company-logo_200_200/0/1592891169820?e=2159024400&v=beta&t=RckE7Vr5w_Iw7KiUu_Q3jBCV6WU3xYaRxEMQKWIqHJI" style="width: 30px; height: 30px; margin-right: 10px;" alt="crownpheonix" />
                        </a>
                        <a href="https://crownphoenixadv.com/">
                            Crown Forms <span style="font-weight: bold;">by Crown Pheonix Marketing Consultancy L.L.C</span>
                        </a>
                    </div>
                </div> 
            `;

            if (data.file) {
                const awaitFile = await data.file;
                const stream = awaitFile.createReadStream();

                await emailTransporter.sendMail({
                    from: config.email.noreply.user,
                    to: `${emails.map(
                        (e, i) => `${e}${emails.length - 1 === i ? "" : ", "}`
                    )}`,
                    subject: `Estimation for ${form.name}.`,
                    attachments: [
                        {
                            filename: awaitFile.filename,
                            content: stream,
                        },
                    ],
                    html,
                });
            } else {
                await emailTransporter.sendMail({
                    from: config.email.noreply.user,
                    to: `${emails.map(
                        (e, i) => `${e}${emails.length - 1 === i ? "" : ", "}`
                    )}`,
                    subject: `Estimation for ${form.name}.`,
                    html,
                });
            }

            return resolve("you have successfully submited the form.");
        } catch (err) {
            return reject(err);
        }
    });

export default {
    getForm,
    getForms,
    addForm,
    deleteForm,
    editForm,
    reorderForms,
    submitForm,
};
