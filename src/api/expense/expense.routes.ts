import express from 'express';

import { getExpenses, getExpenseById, addExpense, updateExpense, removeExpense } from './expense.controller';

const router = express.Router();

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', removeExpense);

export const expenseRoutes = router;
