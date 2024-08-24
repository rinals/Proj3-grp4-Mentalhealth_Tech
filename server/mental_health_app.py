from flask import Flask, jsonify, render_template
import pandas as pd
import sqlite3
from flask_cors import CORS
from wordcloud import STOPWORDS
from collections import Counter
import re

app = Flask(__name__)

# Enable CORS on all routes
CORS(app)

survey_table_name = "survey_data_combined"

# Route for the root URL
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint
@app.route('/tech-workers', methods=['GET'])
def get_tech_workers_data():
    # Define the columns you want to return
    columns = ['survey_date', 'Age', 'Gender', 'company size']

    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT Age, Gender, `company size`, seek_help, mental_health_consequence FROM {survey_table_name} WHERE tech_company = 'Yes';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    # Get the data as JSON
    result = result_df.to_dict(orient='records')
    return jsonify(result)


# API endpoint
@app.route('/mental-vs-physical', methods=['GET'])
def get_mental_vs_physical():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT mental_vs_physical FROM {survey_table_name} WHERE Country = 'United States';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    # Get the data as JSON
    result = result_df.to_dict(orient='records')
    return jsonify(result)

# API endpoint
@app.route('/mental-health-comments', methods=['GET'])
def get_mental_health_comments():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT comments FROM {survey_table_name} WHERE Country = 'United States';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    # Drop rows with None or NaN values in the comments column
    usa_comments_df = result_df.dropna(subset=['comments'])

    # Combine and clean all comments into a single string
    all_comments = ' '.join(usa_comments_df['comments'].dropna().str.lower())

    # Remove punctuation and split text into words
    words = re.findall(r'\b\w+\b', all_comments)

    # Remove common stopwords and define relevant keywords
    stopwords = set(STOPWORDS)
    filtered_words = [word for word in words if word not in stopwords]
    tts_keywords = ['therapy', 'treatment', 'support']
    mental_health_keywords = ['depression', 'anxiety', 'stress'] + ['tts']

    # Replace 'therapy', 'treatment', and 'support' with 'tts'
    filtered_words = ['tts' if word in tts_keywords else word for word in filtered_words]

    # Count the occurrences of relevant mental health words
    word_counts = Counter(word for word in filtered_words if word in mental_health_keywords)

    # Convert the counts to a DataFrame
    word_counts_df = pd.DataFrame(word_counts.items(), columns=['Word', 'Frequency']).sort_values(by='Frequency', ascending=False)

    # Get the data as JSON
    result = word_counts_df.to_dict(orient='records')

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
