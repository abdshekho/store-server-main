import { InputType, ObjectType, Field, Int } from "type-graphql";
import MediaLibrary from "../../entities/mediaLibrary";
import { GraphQLUpload, FileUpload } from "graphql-upload";

@InputType()
export class GetMediaLibraryFilters {
    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    size: number;

    @Field(() => String, { nullable: true })
    search: string;
}

@ObjectType()
export class MediaLibraryResponse {
    @Field(() => [MediaLibrary!]!)
    mediaLibrary: MediaLibrary[];

    @Field()
    count: number;
}

@InputType()
export class MediaLibraryFilesInput {
    @Field(() => String!)
    toFormat: string;

    @Field(() => GraphQLUpload)
    file: FileUpload;

    @Field(() => String)
    description: string;
}
