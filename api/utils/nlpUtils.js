const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizer();
const Sentiment = require('sentiment');

// Create a new sentiment analyzer
const analyzer = new Sentiment();

// Perform sentiment analysis on the provided text
function performSentimentAnalysis(filePath) {
  console.log(filePath);
  // Read the content of the file
  const text = fs.readFileSync(filePath, 'utf8');

  // Tokenize the text into individual words
  const words = tokenizer.tokenize(text);
  console.log(words);

  // Calculate the sentiment score using the sentiment analyzer
  const sentiment = analyzer.analyze(text);
  const wordCount = words.length;

  // Adjust the sentiment score based on the word count
  const adjustedSentimentScore = sentiment.score / Math.sqrt(wordCount);

  return adjustedSentimentScore;
}

module.exports = {
  performSentimentAnalysis
};
