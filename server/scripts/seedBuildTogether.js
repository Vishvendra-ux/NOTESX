// Dev-only: insert sample BuildTogether projects if the collection is empty.
// (Formerly ran on every GET /api/build-together.)
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (process.env.NODE_ENV === 'production') { console.error('Refusing to seed in production'); process.exit(1); }
const { seedDefaultProjectsIfEmpty } = require('../controllers/buildTogetherController');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await seedDefaultProjectsIfEmpty();
  console.log('Sample projects ensured.');
  await mongoose.disconnect();
})();
