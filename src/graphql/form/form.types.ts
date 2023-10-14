import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, Float, InputType, Int, ObjectType } from "type-graphql";
import Form from "../../entities/form";
import { FormInputTextType, FormInputType } from "../../entities/formInput";
import { OperationType } from "../../entities/inputOption";

@InputType()
export class GetFormsOptions {
    @Field({ nullable: true })
    page: number;

    @Field({ nullable: true })
    size: number;

    @Field({ nullable: true })
    search: string;

    @Field({ nullable: true })
    isHidden: boolean;
}

@ObjectType()
export class GetFormsResponse {
    @Field(() => [Form!]!)
    forms: Form[];

    @Field()
    count: number;
}

@InputType()
export class FormEndScreenInput {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    ar_title: string;

    @Field({ nullable: true })
    ar_description: string;

    @Field({ nullable: true })
    image: string;
}

@InputType()
export class FormData {
    @Field({ nullable: true })
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => String, { nullable: true })
    ar_name: string;

    @Field(() => String, { nullable: true })
    ar_description: string;

    @Field(() => String, { nullable: true })
    image: string;

    @Field(() => String, { nullable: true })
    banner: string;

    @Field({ nullable: true })
    isHidden: boolean;

    @Field({ nullable: true })
    isSmartProCard: boolean;

    @Field({ nullable: true })
    isEndScreen: boolean;

    @Field(() => [FormSectionData!]!)
    sections: FormSectionData[];

    @Field({ nullable: true })
    endScreen: FormEndScreenInput;
}

@InputType()
class InputOptionData {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    value: string;

    @Field({ nullable: true })
    ar_value: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int, { nullable: true })
    toSection: number;

    @Field(() => Int, { nullable: true })
    parentOption: number;

    @Field({ nullable: true })
    isOther: boolean;

    @Field({ nullable: true })
    isQty: boolean;

    @Field({ nullable: true })
    operationType: OperationType;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    ar_description: string;

    @Field({ nullable: true })
    image: string;
}

@InputType()
class FormInputData {
    @Field({ nullable: true })
    id: string;

    @Field()
    label: string;

    @Field()
    ar_label: string;

    @Field()
    type: FormInputType;

    @Field({ nullable: true })
    textType: FormInputTextType;

    @Field()
    isRequired: boolean;

    @Field()
    isConditional: boolean;

    @Field()
    isParent: boolean;

    @Field(() => Int, { nullable: true })
    toSection: number;

    @Field(() => Int, { nullable: true })
    parentInput: number;

    @Field({ nullable: true })
    isQty: boolean;

    @Field(() => [InputOptionData!], { nullable: true })
    options: InputOptionData[];
}

@InputType()
class FormSectionData {
    @Field({ nullable: true })
    id: string;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    ar_title: string;

    @Field()
    ar_description: string;

    @Field(() => String, { nullable: true })
    image: string;

    @Field(() => Int)
    order: number;

    @Field(() => [FormInputData!]!)
    inputs: FormInputData[];
}

@InputType()
export class SubmitFormData {
    @Field()
    id: string;

    @Field({ nullable: true })
    date: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    sendToEmail: string;

    @Field(() => Float, { nullable: true })
    totalPrice: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    mobileNumber: string;

    @Field(() => GraphQLUpload!, { nullable: true })
    file: FileUpload;

    @Field(() => [FormInputsData!], { nullable: true })
    inputs: FormInputsData[];
}

@InputType()
class FormInputsData {
    @Field(() => Float, { nullable: true })
    price: number;

    @Field({ nullable: true })
    label: string;

    @Field({ nullable: true })
    value: string;
}
