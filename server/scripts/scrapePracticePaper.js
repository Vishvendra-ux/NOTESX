const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// TARGET URL - Change this to any subject or topic page
const TOPIC_URL = 'https://practicepaper.in/gate-cse/asymptotic-notation';
const OUTPUT_FILE = './gate_questions_scraped.json';

async function scrapeQuestions() {
  console.log(`🚀 Starting scraper for: ${TOPIC_URL}`);
  let questions = [];
  let currentPage = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const url = currentPage === 1 ? TOPIC_URL : `${TOPIC_URL}?page_no=${currentPage}`;
      console.log(`Fetching page ${currentPage}...`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      const questionCards = $('.pp-question-card');
      if (questionCards.length === 0) {
        console.log('No more questions found.');
        break;
      }

      questionCards.each((index, element) => {
        // Extract Header info
        const header = $(element).find('.pp-q-header');
        const qNum = header.find('.pp-q-num').text().trim();
        const type = header.find('.pp-badge').not('.pp-badge-marks').text().trim() || 'MCQ';
        const marksText = header.find('.pp-badge-marks').text().trim();
        const marks = parseInt(marksText) || 1;
        
        // Extract Exam context (e.g. "GATE CSE 2023")
        const ctxLinks = [];
        header.find('.pp-ctx-link').each((i, el) => ctxLinks.push($(el).text().trim()));
        const examYear = ctxLinks[0] || 'GATE';
        const subject = ctxLinks[1] || 'General';

        // Extract Question body (the HTML of the question to preserve images/math)
        const qBody = $(element).find('.pp-q-body').html() || '';

        // Extract Options
        const options = [];
        $(element).find('.pp-option').each((i, opt) => {
          options.push($(opt).text().trim());
        });

        // Extract Answer & Explanation
        const ansBlock = $(element).find('.pp-solution-block');
        const correctAnswer = ansBlock.find('.pp-correct-ans').text().trim();
        const explanation = ansBlock.find('.pp-sol-content').html() || '';

        questions.push({
          examCategory: 'GATE CSE',
          examYear,
          subjectName: subject,
          topic: TOPIC_URL.split('/').pop().replace(/-/g, ' '),
          questionType: type,
          marks,
          questionHtml: qBody.trim(),
          options,
          correctAnswer,
          explanationHtml: explanation.trim()
        });
      });

      // Check if there is a next page
      const nextBtn = $('#ppNextBtn');
      if (nextBtn.length > 0 && !nextBtn.attr('disabled')) {
        currentPage++;
        // Polite delay
        await new Promise(r => setTimeout(r, 2000));
      } else {
        hasNextPage = false;
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2));
    console.log(`✅ Scraped ${questions.length} questions successfully!`);
    console.log(`📁 Saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error(`❌ Scraping failed: ${error.message}`);
  }
}

scrapeQuestions();
