const textract = require('textract');

const extractTextFromPptx = async (filePath) => {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) {
        console.error('Error extracting text from pptx:', error);
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
};

module.exports = {
  extractTextFromPptx
};
