import mongoose from 'mongoose';

// MongoDB connection URL (replace with your own URI)
const MONGO_URI = 'mongodb+srv://sahuaparna1234:MDlGdPwBC3DDMtP1@cluster0.cxj2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // You no longer need to pass 'useNewUrlParser' and 'useUnifiedTopology'
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();
