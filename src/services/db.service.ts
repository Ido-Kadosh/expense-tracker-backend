import mongoDB from 'mongodb';
import { MongoClient } from 'mongodb';
import { config } from '../config';

let dbConn: mongoDB.Db;

const _connect = async () => {
	if (dbConn) return dbConn;
	try {
		const client = await MongoClient.connect(config.dbUrl);
		const db = client.db(config.dbName);
		dbConn = db;
		return db;
	} catch (err) {
		console.error('Cannot Connect to DB', err);
		throw err;
	}
};

const getCollection = async <T extends mongoDB.BSON.Document>(collectionName: string) => {
	try {
		const db = await _connect();
		const collection = db.collection<T>(collectionName);
		return collection;
	} catch (err) {
		console.error('Failed to get Mongo collection', err);
		throw err;
	}
};

export const dbService = {
	getCollection,
};
