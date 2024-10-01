import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth'

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

const mongoUri = 'mongodb+srv://sahuaparna1234:MDlGdPwBC3DDMtP1@cluster0.cxj2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
