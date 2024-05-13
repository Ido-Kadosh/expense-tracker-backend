import { authService } from './auth.service';
import { logger } from '../../services/logger.service';
import { userService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const user = await authService.login(email, password);
		const loginToken = authService.getLoginToken(user);
		logger.info('User login: ', user);
		res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true });
		res.json(user);
	} catch (err) {
		logger.error('Failed to Login ' + err);
		if (err.message) res.status(400).send(err.message);
		else res.status(500).send('Failed to login. Please retry!');
	}
};

export const signup = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const account = await authService.signup(email, password);
		logger.info(`new account created: ` + JSON.stringify(account));
		const user = await authService.login(email, password);
		const loginToken = authService.getLoginToken(user);
		res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true });
		res.json(user);
	} catch (err) {
		logger.error('Failed to signup', err);
		if (err.message) res.status(400).send(err.message);
		else res.status(500).send('Failed to signup. Please retry!');
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie('loginToken');
		return res.send({ msg: 'Logged out successfully' });
	} catch (err) {
		res.status(500).send({ msg: 'Failed to logout' });
	}
};

export const changePassword = async (req: Request, res: Response) => {
	const { userId, currPass, newPass } = req.body;
	try {
		// make sure user exists
		const user = await userService.getById(userId);
		if (!user) return res.status(400).send({ msg: 'User not found' });

		// make sure password is correct
		const match = await bcrypt.compare(currPass, user.password!);
		if (!match) return res.status(400).send({ msg: 'Wrong password' });

		await authService.changePassword(userId, newPass);
		return res.send({ msg: 'Changed password successfully' });
	} catch (err) {
		logger.error(`Something went wrong changing password for user: ${userId}`);
		res.status(500).send('Internal server error');
	}
};
