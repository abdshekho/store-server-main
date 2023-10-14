import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import MediaLibrary from "../../entities/mediaLibrary";
import logic from "../../logic";
import {
    MediaLibraryFilesInput,
    GetMediaLibraryFilters,
    MediaLibraryResponse,
} from "./mediaLibrary.types";

@Resolver()
class MediaLibraryResolver {
    @Query(() => MediaLibrary!)
    async getMediaLibraryItem(@Arg("id") id: string) {
        try {
            const mediaLibrary = await logic.MediaLibrary.getMediaLibraryItem({
                id,
            });

            return mediaLibrary;
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Query(() => MediaLibraryResponse!)
    async getMediaLibrary(@Arg("filters") filters: GetMediaLibraryFilters) {
        try {
            const { page, size } = filters;
            const [mediaLibrary, count] = await MediaLibrary.findAndCount({
                skip: page * size - size,
                take: size,
                order: {
                    createdAt: "DESC",
                },
            });

            return { mediaLibrary, count };
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async addMediaLibrary(
        @Arg("data", () => [MediaLibraryFilesInput!]!)
        data: MediaLibraryFilesInput[]
    ) {
        try {
            await logic.MediaLibrary.addMediaLibrary(data);

            return "You have successfully uploaded files into your media library.";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }

    @Mutation(() => String!)
    async deleteMediaLibrary(@Arg("ids", () => [String!]!) ids: string[]) {
        try {
            await logic.MediaLibrary.deleteMediaLibrary(ids);

            return "You have successfully deleted mediaLibrary items.";
        } catch (err: any) {
            throw new ApolloError(err.message, err.code, err.ext);
        }
    }
}

export default MediaLibraryResolver;
