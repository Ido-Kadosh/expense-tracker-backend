import { logger } from './logger.service';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { IExpense } from '../types/expense';

interface CustomSocket extends Socket {
	name?: string;
}

let gIo: Server | null = null;

export const setupSocketAPI = (server: HttpServer) => {
	gIo = new Server(server, {
		cors: {
			origin: '*',
		},
	});

	gIo.on('connection', (socket: CustomSocket) => {
		logger.info(`New connected socket [id: ${socket.id}]`);

		socket.on('disconnect', () => {
			logger.info(`Socket disconnected [id: ${socket.id}]`);
		});

		socket.on('add-expense', (expense: IExpense) => {
			logger.debug(`socket-service: expense added: ${JSON.stringify(expense)}`);
			socket.broadcast.emit('expense-added', expense);
		});

		socket.on('update-expense', (expense: Partial<IExpense>) => {
			logger.debug(`socket-service: expense updated: ${JSON.stringify(expense)}`);
			socket.broadcast.emit('expense-updated', expense);
		});

		socket.on('remove-expense', (expenseId: string) => {
			logger.debug(`socket-service: expense removed: ${expenseId}`);
			socket.broadcast.emit('expense-removed', expenseId);
		});
	});
};
