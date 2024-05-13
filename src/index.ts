import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { authRoutes } from './api/auth/auth.routes';
import { expenseRoutes } from './api/expense/expense.routes';
import { setupSocketAPI } from './services/socket.service';

const app = express();
const server = http.createServer(app);

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

setupSocketAPI(server);

app.get('/**', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

const port = process.env.PORT || 3030;
server.listen(port, () => {
	console.log('server is running on port:' + port);
});
