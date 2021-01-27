import { BSON } from "realm-web";

export interface ChapterPage {
    imgId: string,
    title: string,
    thumbnail: string,
    url: string,
    googlePrev: string,
    size: number,
    owner: string,
}
export interface Chapter {
    _id: BSON.ObjectID,
    mangaId: string,
    number: number,
    pages: ChapterPage[],
}