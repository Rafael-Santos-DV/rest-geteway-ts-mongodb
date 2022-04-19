import mongoose from 'mongoose';
import config from '../config/database';

const Database = mongoose.connect(config.MONGODB_URL, (error) => {
  if (error) return new Error(`Erro ao conectar! ${error}`);
  console.log('conectado com sucesso!');
});

export default Database;
