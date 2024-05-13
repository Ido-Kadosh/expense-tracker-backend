import express from 'express';

import {
	getExpenses,
	getExpenseById,
	getExpensePriceRanges,
	getCategoryCounts,
	addExpense,
	updateExpense,
	removeExpense,
} from './expense.controller';
import { checkLoggedIn } from '../../middlewares/checkLoggedIn';

const router = express.Router();

router.get('/', getExpenses);
router.get('/range', getExpensePriceRanges);
router.get('/category-counts', getCategoryCounts);
router.get('/:id', getExpenseById);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', checkLoggedIn, removeExpense);

export const expenseRoutes = router;
