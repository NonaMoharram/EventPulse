const mongoose = require('mongoose');

try {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('DNS setup skipped');
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;