import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Pega o token do Header da requisição
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Formato de token inválido.' });
  }

  try {
    // 2. Tenta abrir e validar o token com a nossa chave secreta
    const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao';
    const decoded = jwt.verify(token, secret);

    // 3. Se der certo, extraimos quem é o usuario e salvamos na requisicao
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    // 4. Libera a catraca para o usuario continuar
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
  }
};