import { MongoClient } from "mongodb";

let db;
let client;

const connect = async () => {
    client = await MongoClient.connect("mongodb://localhost");
    db = client.db("user_administration");
};

const disconnect = async () => {
    if (client) {
        await client.close();
    }
};

const MongoDb = {
    connect,
    disconnect,
    getDb: () => db,
};

export default MongoDb;
