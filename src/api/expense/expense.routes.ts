import express from 'express';

import {
	getExpenses,
	getExpenseById,
	getExpensePriceRanges,
	addExpense,
	updateExpense,
	removeExpense,
} from './expense.controller';

const router = express.Router();

router.get('/', getExpenses);
router.get('/range', getExpensePriceRanges);
router.get('/:id', getExpenseById);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', removeExpense);

export const expenseRoutes = router;
