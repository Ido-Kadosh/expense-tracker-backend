import { Request, Response } from 'express';
import { expenseService } from './expense.service';
import { ICategory, IExpenseFilter } from '../../types/expense';

export const getExpenses = async (req: Request, res: Response) => {
	try {
		const filterBy = {
			title: req.query?.title || '',
			minAmount: +req.query?.minAmount || 0,
			maxAmount: +req.query?.maxAmount || 0,
			categories: (req.query?.categories as unknown as ICategory[]) || [],
		};
		const expenses = await expenseService.query(filterBy as IExpenseFilter);
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
		const { _id, ...expense } = req.body; // remove unnecessary _id
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

export const getExpensePriceRanges = async (req: Request, res: Response) => {
	try {
		const ranges = await expenseService.getPriceRanges();
		res.json(ranges);
	} catch (err) {
		res.status(400).send({ err: 'Failed to get ranges' });
	}
};

export const getCategoryCounts = async (req: Request, res: Response) => {
	try {
		const categoryCounts = await expenseService.getCategoryCounts();
		res.json(categoryCounts);
	} catch (err) {
		res.status(400).send({ err: 'Failed to get category counts' });
	}
};
