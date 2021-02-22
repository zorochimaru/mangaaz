import * as Realm from "realm-web";
export const RealmApp = new Realm.App("mangaaz-ryudh");

export function getDB(name: string) {
    return RealmApp.currentUser?.mongoClient("mongodb-atlas").db(name)!;
}
