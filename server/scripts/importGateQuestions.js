const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { importQuestions } = require('../services/gateQuestionImportService');

const jsonFilePath = process.argv[2] || './gate_questions_scraped.json';
const targetSubjectId = process.argv[3];
const targetTopicId = process.argv[4];

const importData = async () => {
  try {
    if (!fs.existsSync(jsonFilePath)) {
      console.error(`❌ File not found: ${jsonFilePath}`);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    if (!Array.isArray(data)) {
      console.error('❌ JSON file must contain an array of questions');
      process.exit(1);
    }
    if (!targetSubjectId || !targetTopicId) {
      console.log('ℹ️  No subjectId/topicId arguments — rows must carry their own subjectId and topicId.');
      console.log('   (Legacy per-topic usage: node importGateQuestions.js <file.json> <subjectId> <topicId>)');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const rows = data.map((q) => ({
      ...q,
      subjectId: q.subjectId || targetSubjectId,
      topicId: q.topicId || targetTopicId
    }));

    console.log(`⏳ Importing ${rows.length} questions...`);
    const report = await importQuestions({ questions: rows });
    console.log(`   total: ${report.total}, inserted: ${report.inserted}, updated: ${report.updated}, rejected: ${report.rejected.length}`);
    report.rejected.slice(0, 20).forEach((r) => console.log(`   ✖ row ${r.row}: ${r.reason}`));
    if (report.rejected.length > 20) {
      console.log(`   ... and ${report.rejected.length - 20} more rejections`);
    }

    console.log('✅ Import finished');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import Failed:', error.message);
    process.exit(1);
  }
};

importData();
