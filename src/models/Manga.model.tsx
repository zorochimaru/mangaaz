import { BSON } from "realm-web";

export interface Manga {
    _id: BSON.ObjectID,
    title: string,
    coverUrl: string,
    description: string,
    genres: string[],
    author: string,
    ownerId: Object | undefined
}