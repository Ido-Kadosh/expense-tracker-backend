export const config = {
	dbName: 'expenseTracker',
	dbUrl: 'mongodb://localhost:27017',
};

if (process.env.NODE_ENV === 'production') {
	config.dbUrl = process.env.mongo_url;
}
