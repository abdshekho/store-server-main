import { NonEmptyArray } from "type-graphql";
import AuthResolver from "./auth/auth.resolver";
import UserResolver from "./user/user.resolver";
import MediaLibraryResolver from "./mediaLibrary/mediaLibrary.resolver";
import CategoryResolver from "./category/category.resolver";
import ProductResolver from "./product/product.resolver";
import ProductCustomizationInfoResolver from "./productCustomizationInfo/productCustomizationInfo.resolver";
import ServiceResolver from "./service/service.resolver";
import ProjectResolver from "./project/projec.resolver";
import DynamicContentResolver from "./dynamicContent/dynamicContent.resolver";
import ComponentResolver from "./Component/component.resolver";
import FormResolver from "./form/form.resolver";
import SmartProCardResolver from "./smartProCard/smartProCard.resolver";
import FormSettingsResolver from "./formSettings/formSettings.resolver";
import EmailSettings from "./emailSettings/emailSettings.resolver";
import BlogResolver from "./blog/blog.resolver";

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
    AuthResolver,
    UserResolver,
    MediaLibraryResolver,
    CategoryResolver,
    ProductResolver,
    ProductCustomizationInfoResolver,
    ServiceResolver,
    ProjectResolver,
    DynamicContentResolver,
    ComponentResolver,
    FormResolver,
    SmartProCardResolver,
    FormSettingsResolver,
    EmailSettings,
    BlogResolver,
];
