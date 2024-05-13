import { NextFunction, Request, Response } from 'express';
import { authService } from '../api/auth/auth.service';

export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	const loginToken = req.cookies?.loginToken;
	if (!loginToken) {
		return res.status(401).send({ msg: 'Please login to perform this action' });
	}
	// Validate the token
	const loggedInUser = authService.validateToken(loginToken);
	if (!loggedInUser) {
		return res.status(401).send({ msg: 'Please login to perform this action' });
	}

	res.locals.loggedInUser = loggedInUser; // set loggedInUser on locals for future use
	next();
};
