import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import { Client } from '../models/Client.js';

export const authController = {
  // Cadastrar
  async register(req, res) {
    try {
      const { nome, email, password } = req.body;

      const clientExists = await Client.findOne({ email });
      if (clientExists) {
        return res.status(400).json({ error: 'Este email já está cadastrado.' });
      }

      // 2. Criptografamos a senha com um "salt" de 10 rodadas (padrão de segurança)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Salvamos o cliente com a senha protegida
      const newClient = new Client({ nome, email, password: hashedPassword });
      await newClient.save();

      return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar o cliente.' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const client = await Client.findOne({ email });
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      // 4. Comparamos a senha digitada com o "hash" salvo no banco
      const isValidPassword = await bcrypt.compare(password, client.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

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