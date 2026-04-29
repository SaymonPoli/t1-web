import { Client } from '../models/Client.js';

export const clientController = {
  // Retorna os dados do cliente que já está logado
  async getProfile(req, res) {
    try {
      const client = await Client.findOne({ email: req.userEmail }).select('-password'); 
      
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.status(200).json(client);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar o perfil do cliente.' });
    }
  }
};