import * as Realm from "realm-web";
export const RealmApp = new Realm.App("manga-rlmtr");

export function getDB(name: string) {
    return RealmApp.currentUser?.mongoClient("mongodb-atlas").db(name)!;
}
