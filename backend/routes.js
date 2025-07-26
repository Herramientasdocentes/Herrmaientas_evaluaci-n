// Import and re-export routes from original location
module.exports = {
  assessment: require('../routes/assessment'),
  auth: require('../routes/auth'),
  questionBank: require('../routes/questionBank'),
  questions: require('../routes/questions')
};
