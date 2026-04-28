import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true, // Garante que não existam dois clientes com o mesmo email
    lowercase: true, // Converte sempre para minúsculas antes de salvar
    trim: true // Remove espaços extras no início ou fim
  },
  password: {
    type: String,
    required: [true, 'A password é obrigatória'],
    minlength: [6, 'A password deve ter pelo menos 6 caracteres']
  }
}, { 
  timestamps: true // Cria automaticamente os campos "createdAt" e "updatedAt"
});

export const Client = mongoose.model('Client', clientSchema);