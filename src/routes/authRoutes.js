import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

// Rota para cadastrar o cliente
router.post('/register', authController.register);

// Rota para fazer login
router.post('/login', authController.login);

export default router;