import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service';
import { Expense } from '../../types/expense';
import { logger } from '../../services/logger.service';

const COLLECTION_NAME = 'expense';

const query = async () => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const expenses = await collection.find({}).toArray();
		return expenses;
	} catch (err) {
		logger.error('cannot find expenses', err);
		throw err;
	}
};

const getById = async (expenseId: string) => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const expense = await collection.findOne({ _id: new ObjectId(expenseId) });
		if (expense) {
			return expense;
		}
		throw new Error('error finding expense');
	} catch (err) {
		logger.error(`cannot find expense ${expenseId}`, err);
		throw err;
	}
};

const add = async (expense: Expense) => {
	try {
		const { _id, ...expenseWithoutId } = expense;
		const collection = await dbService.getCollection(COLLECTION_NAME);
		await collection.insertOne(expenseWithoutId);
	} catch (err) {
		logger.error('error adding expense', err);
		throw err;
	}
};

const update = async (expense: Expense) => {
	try {
		const id = expense._id;
		delete expense._id;
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const updatedExpense = await collection.updateOne({ _id: new ObjectId(id) }, { $set: expense });
		return updatedExpense;
	} catch (err) {
		logger.error(`error updating expense ${expense._id}`, err);
		throw err;
	}
};
const remove = async (expenseId: string) => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const result = await collection.deleteOne({ _id: new ObjectId(expenseId) });

		if (result.deletedCount) return expenseId;
		throw new Error('error finding expense');
	} catch (err) {
		logger.error(`error removing expense ${expenseId}`, err);
		throw err;
	}
};

export const expenseService = {
	query,
	getById,
	update,
	add,
	remove,
};
