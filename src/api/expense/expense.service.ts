import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service';
import { IExpense, IExpenseFilter } from '../../types/expense';
import { logger } from '../../services/logger.service';

const COLLECTION_NAME = 'expense';

const query = async (filterBy: IExpenseFilter) => {
	try {
		const criteria = _buildCriteria(filterBy);
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const expenses = await collection.find(criteria, { sort: { createdAt: -1 } }).toArray();
		return expenses;
	} catch (err) {
		logger.error('error finding expenses', err);
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
		throw new Error('cannot find expense');
	} catch (err) {
		logger.error(`error finding expense ${expenseId}`, err);
		throw err;
	}
};

const add = async (expense: Omit<IExpense, '_id'>) => {
	try {
		expense.createdAt = Date.now();
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const addedExpense = await collection.insertOne(expense);
		return addedExpense;
	} catch (err) {
		logger.error('error adding expense', err);
		throw err;
	}
};

const update = async (expense: IExpense) => {
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
		throw new Error('cannot find expense');
	} catch (err) {
		logger.error(`error removing expense ${expenseId}`, err);
		throw err;
	}
};

const getPriceRanges = async () => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const result = await collection
			.aggregate([
				{
					$group: {
						_id: null,
						max: { $max: '$amount' },
						min: { $min: '$amount' },
					},
				},
				{
					$project: {
						_id: 0,
						max: { $ceil: '$max' },
						min: { $floor: '$min' },
					},
				},
			])
			.toArray();
		if (result.length === 0) {
			logger.info('no expenses found');
			return { min: 1, max: 1000 };
		}
		delete result[0]._id;
		// make sure min and max are never equal
		if (result[0].min === result[0].max) result[0].min -= 1;

		return result[0];
	} catch (err) {
		logger.error('error getting price ranges', err);
		throw err;
	}
};

const getCategoryCounts = async () => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const categoryCounts = await collection
			.aggregate([
				{ $unwind: '$categories' },
				{
					$group: {
						_id: '$categories.id',
						count: { $sum: 1 },
						txt: { $first: '$categories.txt' },
						imgUrl: { $first: '$categories.imgUrl' },
					},
				}, // groups by category id, and aggregates the first occurrence of txt and imgUrl
				{ $project: { _id: 0, txt: 1, count: 1, imgUrl: 1 } }, // reshape the documents to elevate txt, count, and imgUrl to the top level
				{ $sort: { txt: 1 } },
			])
			.toArray();
		return categoryCounts;
	} catch (err) {
		logger.error('error getting category counts', err);
	}
};

const _buildCriteria = (filterBy: IExpenseFilter) => {
	const criteria: Record<string, any> = {};
	if (filterBy.title) {
		criteria.title = { $regex: filterBy.title, $options: 'i' };
	}
	if (filterBy.minAmount) {
		criteria.amount ??= {};
		criteria.amount.$gte = filterBy.minAmount;
	}
	if (filterBy.maxAmount) {
		criteria.amount ??= {};
		criteria.amount.$lte = filterBy.maxAmount;
	}
	return criteria;
};

export const expenseService = {
	query,
	getById,
	update,
	add,
	remove,
	getPriceRanges,
	getCategoryCounts,
};
