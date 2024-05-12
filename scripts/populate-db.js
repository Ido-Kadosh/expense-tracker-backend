const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'expenseTracker';
const collectionName = 'expense';

const jsonData = [
	{ title: 'Groceries', amount: 50, createdAt: Date.now(), categories: [] },
	{ title: 'Shoes', amount: 250, createdAt: Date.now(), categories: [] },
	{ title: 'Coffee', amount: 1444, createdAt: Date.now(), categories: [] },
];

async function main() {
	const client = new MongoClient(url, { useUnifiedTopology: true });

	try {
		await client.connect();
		console.log('Connected successfully to server');

		const db = client.db(dbName);
		const collection = db.collection(collectionName);

		// Clear the collection before inserting
		await collection.deleteMany({});

		// Insert the JSON data into the collection
		const insertResult = await collection.insertMany(jsonData);
		console.log('Inserted documents:', insertResult.insertedCount);
	} catch (err) {
		console.error('An error occurred:', err);
	} finally {
		await client.close();
	}
}

main().catch(console.error);
