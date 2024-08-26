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

    query = f"SELECT mental_health_consequence, phys_health_consequence FROM {survey_table_name} WHERE Country = 'United States';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    # Get the data as JSON
    result = result_df.to_dict(orient='records')
    return jsonify(result)

# API endpoint
@app.route('/mental-health-comments', methods=['GET'])
def get_mental_health_comments():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT Classification FROM {survey_table_name} WHERE Country = 'United States';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    classification_frequency = result_df['Classification'].value_counts()

    # Convert the frequency count to a DataFrame
    classification_frequency_df = classification_frequency.reset_index()
    classification_frequency_df.columns = ['Classification', 'Frequency']

    # Calculate the percentage of each classification
    classification_frequency_df['Percentage'] = (classification_frequency_df['Frequency'] / classification_frequency_df['Frequency'].sum()) * 100

    # Get the data as JSON
    result = classification_frequency_df.to_dict(orient='records')

    return jsonify(result)

# API endpoint
@app.route('/themes-in-comments', methods=['GET'])
def get_themes_in_comments():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT comments FROM {survey_table_name} WHERE Country = 'United States';"
    result_df = pd.read_sql_query(query, conn)
    usa_comments_df = result_df.dropna(subset=['comments'])
    usa_comments_df['comments'] = usa_comments_df['comments'].str.lower()

    conn.close()

    # Get the data as JSON
    result = usa_comments_df.to_dict(orient='records')
    return jsonify(result)

# API endpoint
@app.route('/classified-comments-large-companies', methods=['GET'])
def get_classified_comments_large_companies():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT seek_help, leave, comments, Classification, `company size` FROM {survey_table_name} WHERE Country = 'United States';"
    usa_data = pd.read_sql_query(query, conn)

    conn.close()

    # Drop rows where comments are null
    usa_data = usa_data.dropna(subset=['comments'])

    large_company_df = usa_data[usa_data['company size'] == 'Large'][['comments', 'Classification']].copy()
    classified_comments = large_company_df[large_company_df['Classification'].isin(['Anxiety', 'Depression', 'Both'])]

    result = classified_comments.to_dict(orient='records')
    return jsonify(result)

# API endpoint
@app.route('/unclassified-comments-large-companies', methods=['GET'])
def get_unclassified_comments_large_companies():
    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT seek_help, leave, comments, Classification, `company size` FROM {survey_table_name} WHERE Country = 'United States';"
    usa_data = pd.read_sql_query(query, conn)

    conn.close()

    # Drop rows where comments are null
    usa_data = usa_data.dropna(subset=['comments'])

    large_company_df = usa_data[usa_data['company size'] == 'Large'][['comments', 'Classification']].copy()
    unclassified_comments = large_company_df[large_company_df['Classification'] == 'Unclassified']

    result = unclassified_comments.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
