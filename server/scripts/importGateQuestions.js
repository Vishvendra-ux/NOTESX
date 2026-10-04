const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const GateQuestion = require('../models/GateQuestion');

const jsonFilePath = process.argv[2] || './gate_questions_scraped.json';
const targetSubjectId = process.argv[3]; 
const targetTopicId = process.argv[4];

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    if (!fs.existsSync(jsonFilePath)) {
      console.error(`❌ File not found: ${jsonFilePath}`);
      process.exit(1);
    }

    if (!targetSubjectId || !targetTopicId) {
      console.error('❌ Please provide subjectId and topicId.');
      console.log('Usage: node importGateQuestions.js <file.json> <subjectId> <topicId>');
      console.log('Example: node importGateQuestions.js data.json algorithms algo-analysis');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Format data to match our schema
    const formattedData = data.map(q => ({
      examCategory: q.examCategory || 'GATE CSE',
      examYear: q.examYear || 'Unknown Year',
      subjectId: targetSubjectId,
      topicId: targetTopicId,
      subjectName: q.subjectName || targetSubjectId,
      topicName: q.topic || targetTopicId,
      questionType: q.questionType || 'MCQ',
      marks: q.marks || 1,
      questionHtml: q.questionHtml || q.question || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanationHtml: q.explanationHtml || q.explanation || ''
    }));

    console.log(`⏳ Importing ${formattedData.length} questions...`);
    
    // Idempotent upsert keyed by a stable hash of the question identity
    const ops = formattedData.map(q => {
      const sourceKey = crypto.createHash('sha1')
        .update([q.subjectId, q.topicId, q.examYear, q.questionHtml].join('|'))
        .digest('hex');
      return {
        updateOne: {
          filter: { sourceKey },
          update: { $set: { ...q, sourceKey } },
          upsert: true
        }
      };
    });
    const result = await GateQuestion.bulkWrite(ops, { ordered: false });
    console.log(`   inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}`);
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Import Failed:', error);
    process.exit(1);
  }
};

importData();
