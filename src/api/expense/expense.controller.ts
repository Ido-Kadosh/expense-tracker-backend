import { Request, Response } from 'express';
import { expenseService } from './expense.service';

export const getExpenses = async (req: Request, res: Response) => {
	try {
		const expenses = await expenseService.query();
		res.json(expenses);
	} catch (err) {
		res.status(400).send({ err: 'Failed to get expenses' });
	}
};

export const getExpenseById = async (req: Request, res: Response) => {
	try {
		const expenseId = req.params.id;
		const expense = await expenseService.getById(expenseId);
		res.json(expense);
	} catch (err) {
		res.status(400).send({ err: 'Failed to get expense' });
	}
};

export const addExpense = async (req: Request, res: Response) => {
	try {
		const expense = req.body;
		const addedExpense = await expenseService.add(expense);
		res.json(addedExpense);
	} catch (err) {
		res.status(400).send({ err: 'Failed to add expense' });
	}
};

export const updateExpense = async (req: Request, res: Response) => {
	try {
		const expense = req.body;
		const updatedExpense = await expenseService.update(expense);
		res.json(updatedExpense);
	} catch (err) {
		res.status(400).send({ err: 'Failed to update expense' });
	}
};

export const removeExpense = async (req: Request, res: Response) => {
	try {
		const expenseId = req.params.id;
		const removedId = await expenseService.remove(expenseId);
		res.json(removedId);
	} catch (err) {
		res.status(400).send({ err: 'Failed to remove expense' });
	}
};
