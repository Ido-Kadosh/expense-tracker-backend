import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service';
import { logger } from '../../services/logger.service';
import { IUser } from '../../types/user';

const COLLECTION_NAME = 'user';

const getById = async (userId: string) => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const user = (await collection.findOne({ _id: new ObjectId(userId) })) as unknown as IUser;
		if (user) {
			delete user.password; // delete password!
			return user;
		}
		throw new Error('cannot find user');
	} catch (err) {
		logger.error(`error finding user: ${userId}`, err);
		throw err;
	}
};

const add = async (user: Omit<IUser, '_id'>) => {
	try {
		user.createdAt = Date.now();
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const addedUser = (await collection.insertOne(user)) as unknown as IUser;
		delete addedUser.password; // delete password!
		return addedUser;
	} catch (err) {
		logger.error('error adding user', err);
		throw err;
	}
};

export const userService = {
	getById,
	add,
};
