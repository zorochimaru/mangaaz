import { RemoteMongoClient, Stitch } from 'mongodb-stitch-browser-sdk';

const client = Stitch.initializeDefaultAppClient('manga-rlmtr');

export function getDB(name: any) {
    return client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(name);
}
