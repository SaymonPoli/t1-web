import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  apelido: { 
    type: String, 
    required: true 
  },
  DeviceID: { 
    type: String, 
    required: true, 
    unique: true 
  },
  DevicePWD: { 
    type: String, 
    required: true 
  },
  unidade: { 
    type: String, 
    required: true 
  },
  valor: { 
    type: String, 
    default: null 
  },
  clienteEmail: { 
    type: String, 
    required: true 
  } 
}, { timestamps: true });

export const Sensor = mongoose.model('Sensor', sensorSchema);