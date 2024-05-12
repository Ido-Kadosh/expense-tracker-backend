import cors from 'cors';
import express from 'express';
import path from 'path';
import { expenseRoutes } from './api/expense/expense.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('public')));
} else {
	const corsOptions = {
		origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
		credentials: true,
	};
	app.use(cors(corsOptions));
}

app.use('/api/expense', expenseRoutes);

app.get('/**', (req, res) => {
	res.sendFile(path.resolve('public/index.html'));
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
	console.log('server is running on port:' + port);
});
