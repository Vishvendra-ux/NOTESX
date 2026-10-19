// Compatibility wrapper: routes / exports from aiAssistantController
const aiAssistant = require('./aiAssistantController');

module.exports = {
  ...aiAssistant,
  ask: aiAssistant.ask,
  getQuota: aiAssistant.getQuota,
  matchNavigationFromPrompt: aiAssistant.matchNavigationFromPrompt,
  normalizeNavigation: aiAssistant.normalizeNavigation,
  SITE_PAGES: aiAssistant.SITE_PAGES,
  FREE_DAILY_LIMIT: aiAssistant.FREE_DAILY_LIMIT,
  isUserPro: aiAssistant.isUserPro
};
