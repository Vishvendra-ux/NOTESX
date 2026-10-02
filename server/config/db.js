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

const seedDemoStudentUser = async () => {
  try {
    const User = require('../models/User');
    const existing = await User.findOne({ email: 'student.demo@notesx.edu' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('student123', salt);
      await User.create({
        name: 'Demo Student',
        email: 'student.demo@notesx.edu',
        password: hashedPassword,
        role: 'student',
        collegeName: 'GLA University',
        course: 'B.Tech CSE',
        year: '3rd Year',
        isVerified: true
      });
      console.log('✅ Demo Student Account Initialized: student.demo@notesx.edu');
    }
  } catch (err) {
    console.error('Error seeding demo student user:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
    await seedDemoStudentUser();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
