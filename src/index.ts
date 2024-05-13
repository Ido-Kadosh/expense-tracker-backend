import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import { expenseRoutes } from './api/expense/expense.routes';
import { authRoutes } from './api/auth/auth.routes';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'public')));
} else {
	const corsOptions = {
		origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
		credentials: true,
	};
	app.use(cors(corsOptions));
}

app.use('/api/expense', expenseRoutes);
app.use('/api/auth', authRoutes);

app.get('/**', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


const port = process.env.PORT || 3030;
app.listen(port, () => {
	console.log('server is running on port:' + port);
});
