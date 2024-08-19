from flask import Flask, jsonify
import pandas as pd
import sqlite3
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS on all routes
CORS(app)

# API endpoint
@app.route('/tech-workers', methods=['GET'])
def get_tech_workers_data():
    # Define the columns you want to return
    columns = ['survey_date', 'Age', 'Gender', 'company_size']

    conn = sqlite3.connect('./survey_database.db')

    query = f"SELECT survey_date, Age, Gender, company_size, seek_help, mental_health_consequence FROM survey_data WHERE tech_company = 'Yes';"
    result_df = pd.read_sql_query(query, conn)

    conn.close()

    # Get the data as JSON
    result = result_df.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)