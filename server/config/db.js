const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
  try {
    const User = require('../models/User');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    // Do not seed or reset credentials if environment variables are not supplied
    if (!adminEmail || !adminPass) {
      return;
    }

    // Do not overwrite or delete existing users
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPass, salt);

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      reputation: 9999,
      badges: ['👑 System Admin', '🔥 Creator'],
      isVerified: true
    });

    console.log(`✅ Admin Account Initialized: ${admin.email}`);
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
