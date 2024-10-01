import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://sahuaparna1234:MDlGdPwBC3DDMtP1@cluster0.cxj2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB Connected');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
