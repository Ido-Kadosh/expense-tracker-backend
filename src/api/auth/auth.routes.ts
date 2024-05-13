import express from 'express';
import { login, signup, logout, changePassword } from './auth.controller';
import { checkLoggedIn } from '../../middlewares/checkLoggedIn';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/change', checkLoggedIn, changePassword);

export const authRoutes = router;
