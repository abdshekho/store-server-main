import { InputType, ObjectType, Field, Int } from "type-graphql";
import Project from "../../entities/project";

@InputType()
export class GetProjectFilters {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;

    @Field({ nullable: true })
    parent: string;
}

@ObjectType()
export class ProjectResponse {
    @Field(() => [Project!]!)
    projects: Project[];

    @Field()
    count: number;
}

@InputType()
export class ProjectInput {
    @Field(() => String!)
    client: string;

    @Field(() => String!)
    title: string;

    @Field(() => String!)
    description: string;

    @Field(() => String!)
    ar_client: string;

    @Field(() => String!)
    ar_title: string;

    @Field(() => String!)
    ar_description: string;

    @Field(() => String!)
    location: string;

    @Field(() => String!)
    cover: string;

    @Field(() => String!)
    banner: string;

    @Field(() => [String!]!)
    gallery: string[];

    @Field({ nullable: true })
    parent: string;
}
