import { Sensor } from '../models/Sensor.js';
import crypto from 'crypto';

export const sensorController = {
  // 1. cadastra novo sensor
  async createSensor(req, res) {
    try {
      const { apelido, unidade, clienteEmail } = req.body;

      // pra gerar ids e senhas aleatorias
      const DeviceID = crypto.randomBytes(4).toString('hex').toUpperCase(); // Ex: 8F4B2A1C
      const DevicePWD = crypto.randomBytes(4).toString('hex'); // Ex: 1a2b3c4d

      const newSensor = new Sensor({
        apelido,
        DeviceID,
        DevicePWD,
        unidade,
        clienteEmail
      });

      await newSensor.save();

      return res.status(201).json({
        message: 'Sensor cadastrado com sucesso!',
        sensor: newSensor
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o sensor.' });
    }
  },

  // 2. Listar sensores de um cliente
  async getSensors(req, res) {
    try {
      const { clienteEmail } = req.query; // É só temporário até termos o login/token
      const sensors = await Sensor.find({ clienteEmail });
      return res.status(200).json(sensors);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar sensores.' });
    }
  },

  // 3. Editar o apelido do sensor
  async updateSensor(req, res) {
    try {
      const { id } = req.params;
      const { apelido } = req.body;

      const updatedSensor = await Sensor.findByIdAndUpdate(
        id,
        { apelido },
        { new: true }
      );

      return res.status(200).json({
        message: 'Apelido atualizado com sucesso!',
        sensor: updatedSensor
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o sensor.' });
    }
  },

  // 4. Remover sensor
  async deleteSensor(req, res) {
    try {
      const { id } = req.params;
      await Sensor.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Sensor removido com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover o sensor.' });
    }
  }
};