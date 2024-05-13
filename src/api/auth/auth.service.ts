import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';

import { userService } from '../user/user.service';
import { logger } from '../../services/logger.service';
import { dbService } from '../../services/db.service';
import { IUser } from '../../types/user';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'user';
const cryptr = new Cryptr(process.env.SECRET1 || 'dJRuOrofAX57jI4');

const login = async (email: string, password: string) => {
	try {
		logger.debug(`auth.service - login with email: ${email}`);

		const user = await _getUserByEmail(email);
		if (!user) throw new Error('Invalid email or password');

		const match = await bcrypt.compare(password, user.password!);
		if (!match) throw new Error('Invalid email or password');

		delete user.password;
		return user;
	} catch (err) {
		logger.error(`while trying to login with email: ${email}`, err);
		throw err;
	}
};

const signup = async (email: string, password: string) => {
	const saltRounds = 10;
	// give user default image
	const imgUrl = 'https://res.cloudinary.com/diyikz4gq/image/upload/v1685731091/default-user_p7r1gy.png';
	logger.debug(`auth.service - signup with email: ${email}`);
	if (!email || !password) throw new Error('Missing required signup information');

	const userExist = await _getUserByEmail(email);
	if (userExist) throw new Error('Email already taken');

	const hash = await bcrypt.hash(password, saltRounds);
	return userService.add({ email, password: hash, imgUrl });
};

const getLoginToken = (user: IUser) => {
	const userInfo = { _id: user._id, email: user.email };
	return cryptr.encrypt(JSON.stringify(userInfo));
};

const validateToken = (loginToken: string) => {
	try {
		const json = cryptr.decrypt(loginToken);
		const loggedInUser = JSON.parse(json);
		return loggedInUser;
	} catch (err) {
		logger.info('Invalid login token');
	}
	return null;
};

const changePassword = async (userId: string, newPass: string) => {
	try {
		const saltRounds = 10;
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const user = (await collection.findOne({ _id: new ObjectId(userId) })) as unknown as IUser;
		if (!user) throw Error(`Cannot find user with id: ${userId}`);
		const hash = await bcrypt.hash(newPass, saltRounds);
		user.password = hash;
		delete user._id;

		await collection.updateOne({ _id: new ObjectId(userId) }, { $set: user });
	} catch (err) {
		logger.error(`error changing password for user: ${userId}`);
		throw err;
	}
};

//since we don't remove password, this function is located in auth instead of user so it's not accidentally used.
const _getUserByEmail = async (email: string) => {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME);
		const user = (await collection.findOne({ email })) as unknown as IUser;
		return user;
	} catch (err) {
		logger.error(`while finding user by email: ${email}`, err);
		throw err;
	}
};

export const authService = {
	signup,
	login,
	getLoginToken,
	validateToken,
	changePassword,
};
