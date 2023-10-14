import { Field, InputType, Int, ObjectType } from "type-graphql";
import Blog from "../../entities/blog";

@ObjectType()
export class BlogResponse {
    @Field(() => [Blog!]!)
    blogs: Blog[];

    @Field()
    count: number;
}

@InputType()
export class BlogOptions {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;

    @Field(() => Boolean, { defaultValue: true, nullable: true })
    isDraft: boolean;

    @Field(() => Boolean, { defaultValue: false, nullable: true })
    isPublished: boolean;
}

@InputType()
export class BlogChangeStatusInput {
    @Field(() => [String!]!)
    ids: string[];

    @Field(() => Boolean)
    isDraft: boolean;

    @Field(() => Boolean)
    isPublished: boolean;
}

@InputType()
export class BlogLangInput {
    @Field()
    en: string;

    @Field(() => String, { nullable: true })
    ar: string;
}

@InputType()
export class BlogInput {
    @Field(() => BlogLangInput!)
    author: BlogLangInput;

    @Field(() => BlogLangInput!)
    title: BlogLangInput;

    @Field(() => BlogLangInput!)
    intro: BlogLangInput;

    @Field(() => BlogLangInput!)
    textarea: BlogLangInput;

    @Field()
    cover: string;

    @Field(() => [String!]!, { nullable: true })
    gallery: string[];

    @Field(() => Boolean, { defaultValue: true })
    isDraft: boolean;

    @Field(() => Boolean, { defaultValue: true })
    isPublished: boolean;
}
