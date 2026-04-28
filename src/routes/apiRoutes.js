import { Router } from 'express';
import { sensorController } from '../controllers/sensorController.js';

const router = Router();

// Cadastrar um novo sensor (gera ID e Senha)
router.post('/sensors', sensorController.createSensor);

// Listar os sensores do cliente
router.get('/sensors', sensorController.getSensors);

// Editar o apelido do sensor
router.put('/sensors/:id', sensorController.updateSensor);

// Remover um dispositivo
router.delete('/sensors/:id', sensorController.deleteSensor);

// Rota para o simulador enviar dados
router.post('/sensors/data', sensorController.receiveData);

export default router;