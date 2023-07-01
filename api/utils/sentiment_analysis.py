import sys
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('vader_lexicon', () => {})

def perform_sentiment_analysis(text):
    # Create an instance of the sentiment analyzer
    analyzer = SentimentIntensityAnalyzer()

    # Perform sentiment analysis on the provided text
    sentiment_scores = analyzer.polarity_scores(text)
    compound_score = sentiment_scores['compound']

    return compound_score

# Check if the correct number of arguments is provided
if len(sys.argv) != 2:
    print("Invalid number of arguments.")
    sys.exit(1)

# Get the filename from the command-line argument
filename = sys.argv[1]

try:
    # Open the file and read its contents
    with open(filename, 'r') as file:
        text = file.read()

    # Perform sentiment analysis on the provided text
    sentiment_score = perform_sentiment_analysis(text)

    # Print the sentiment score
    print(sentiment_score)

    # Exit with a success code
    sys.exit(0)

except Exception as e:
    # Print the error message if any error occurs
    print("An error occurred:", str(e))
    # Exit with a non-zero error code
    sys.exit(1)
