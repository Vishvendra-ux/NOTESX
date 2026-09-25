const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
  try {
    const User = require('../models/User');
    const adminEmail = 'pratapsinghvishvendra6@gmail.com';
    const adminPass = 'Vishu@123&#';

    // Delete existing admin user to ensure clean hash alignment
    await User.deleteMany({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPass, salt);

    const admin = await User.create({
      name: 'Vishvendra Pratap Singh',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      reputation: 9999,
      badges: ['👑 System Admin', '🔥 Creator'],
      isVerified: true
    });

    console.log(`✅ Admin Account Cleanly Created & Ready for Sign-in: ${admin.email}`);
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
