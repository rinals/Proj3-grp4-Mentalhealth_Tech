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

    conn.close()

    # Get the data as JSON
    result = usa_comments_df.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
