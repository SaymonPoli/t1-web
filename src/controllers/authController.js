import jwt from 'jsonwebtoken';
import { Client } from '../models/Client.js';

export const authController = {
  // 1. Cadastrar um novo cliente
  async register(req, res) {
    try {
      const { nome, email, password } = req.body;

      // Verifica se o email já está em uso
      const clientExists = await Client.findOne({ email });
      if (clientExists) {
        return res.status(400).json({ error: 'Este email já está cadastrado.' });
      }

      const newClient = new Client({ nome, email, password });
      await newClient.save();

      return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o cliente.' });
    }
  },

  // 2. Fazer Login e gerar o Token
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Busca o cliente pelo email
      const client = await Client.findOne({ email });
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      // Verifica se a senha bate
      if (client.password !== password) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Gera o Token JWT (Validade de 1 hora)
      // Usamos uma chave secreta do .env ou uma padrão de fallback
      const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao';
      const token = jwt.sign(
        { id: client._id, email: client.email }, 
        secret, 
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        token,
        cliente: { id: client._id, nome: client.nome, email: client.email }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
  }
};