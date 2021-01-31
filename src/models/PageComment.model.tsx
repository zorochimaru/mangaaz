import { BSON } from "realm-web";

export interface MiniUser {
    authorId: string | undefined,
    authorName: string | undefined,
    authorImg: string | undefined
}

export interface PageComment {
    _id: BSON.ObjectID,
    authorName: string,
    authorImg: string,
    imgId: string,
    authorId: string,
    text: string,
    date: Date,
    likes: MiniUser[]
}