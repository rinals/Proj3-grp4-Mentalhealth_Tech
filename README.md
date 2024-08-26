# Proj3-grp4-Mentalhealth_Tech

# <u>The Invisible Struggle: Mental Health in the Tech Industry</u>

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [SQLite Database Creation and Table Combination](#sqlite-database-creation-and-table-combination)
3. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
4. [Steps](#steps)
5. [Flask Server](#flask-server)
6. [Client Application](#client-application)
7. [How to Run](#how-to-run)
8. [RunServer](#run-server)
9. [WordCloud](#word-cloud)
11. [Known Issues and Limitations](#known-issues-and-limitations)
12. [Acknowledgements](#acknowledgments)
13. [Contact](#contact)

# Introduction

This project, "The Invisible Struggle: Mental Health in the Tech Industry," focuses on analyzing mental health data within the tech industry. It involves creating an SQLite database from survey data, combining tables, transforming and visualizing the data through an Entity-Relationship Diagram (ERD). The project also includes a Flask server that serves a JSON API and a client-side application that visualizes the data using Plotly and d3.js.

## Prerequisites
Necessary software and tools required to run the project:

- Python 3.x
- Flask
- Flask-CORS
- SQLite
- Plotly
- D3.js (included in the project)


# SQLite Database Creation and Table Combination

This project outlines the steps to create and manipulate an SQLite database using survey data and visualize the data structure through an Entity-Relationship Diagram (ERD).

## Entity-Relationship Diagram (ERD)

The ERD below represents the structure and relationships between the survey tables used in this project:

![Database_ERD](images/Database_ERD.png)

- **survey_1**: Contains basic demographic and personal information of respondents.
- **survey_2**: Contains additional survey responses related to workplace and mental health.
- **classified_usa_comments**: Contains classified comments and additional data linked to respondents.
-  **Primary key is `survey_id` to join across all tables

## Steps:

1. **Create SQLite Connection:**
   - Establish a connection to the SQLite database named `survey_database.db`.
   - SQLite is often preferred for smaller projects or applications where simplicity and minimal setup are key, as it is a lightweight, serverless database that stores data in a single file and requires no configuration. In contrast, PostgreSQL is a more powerful, full-featured database that is better suited for complex, multi-user applications but requires more setup and maintenance. SQLite is easier to use for quick development and testing, while PostgreSQL offers greater scalability and advanced features for larger-scale deployments.

2. **Create Tables:**
   - Convert and load three DataFrames (`survey_1_df`, `survey_2_df`, `survey_3_df`) into three separate SQLite tables named `survey_1`, `survey_2`, and `classified_usa_comments`.

3. **Drop Existing Combined Table:**
   - Remove the existing `survey_data_combined` table if it exists to avoid conflicts.

4. **Create Combined Table:**
   - Merge data from the three tables into a new table called `survey_data_combined` using SQL `JOIN` operations:
     - Perform an inner join between `survey_1` and `survey_2` on `survey_id`.
     - Perform a left join with `classified_usa_comments` on `survey_id` to include the `classification` data.

5. **Commit Changes and Close Connection:**
   - Save the changes and close the database connection.

6. **Verify Data:**
   - Query and display the combined data from `survey_data_combined` to ensure the merge was successful.

7. **Output:**
   - The combined data is displayed in a tabular format for review.


## FLASK Server
The Flask app server/mental_health_app.py exposes a JSON API.
Each API function returns relevant data that the client can use for plotting and analysis.

Each API function handles one query e.g.:
1. '/mental-vs-physical': Compares mental and physical health responses.
2. '//mental-health-comments': Returns classified comments related to mental health.

## Client Application

The client-side application (`client/mental_health_dashboard.html`) includes a menu that invokes JavaScript functions to interact with the JSON API. The received data is then visualized using Plotly.

- Menu on the left invokes javascript functions for each menu item.
- The function handleMenuClick gets the name of the menu item as variable 'section'.
- This 'section' is used to query the JSON API.
- The received JSON is then used to plot graphs using plotly.



## HOW TO RUN
### Start Server
1. **Install flask and flask-cors:**
pip install flask
pip install flask_cors

## Run server
python server/mental_health_app.py
This will show the address. Copy and paste in browser.
e.g.
```
python server/mental_health_app.py
 * Serving Flask app 'mental_health_app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 131-636-924
 ```

### Make sure you see something like this
Running on http://127.0.0.1:5000
This address is important and is used in the client when making API requests
e.g. const apiUrl = 'http://127.0.0.1:5000/' + section;

## Word cloud
- The word cloud images are generated using javascript d3 library.
- d3-cloud library randomly places the words in different locations within the image, due to which the image may look slightly different each time we click on the menu item.
- d3 cloud library issues:
https://unpkg.com/d3-cloud/build/d3.layout.cloud.js can sometimes fail to download when HTML page is opened.
To mitigate this we downloaded the javascript file into our repository in 'server/static/js'

## Known Issues and Limitations
- The d3-cloud library may occasionally fail to load. To mitigate this, we downloaded the JavaScript file into our repository under `server/static/js`.
- Word cloud images may vary slightly due to the random placement of words by the D3 library.
- The project currently uses a development server, which is not suitable for production deployment.

## Acknowledgments

- Our instructors, Elias Castro Hernandez, Brian Perry, Karen Silso for continuous guidance and support throughout the project.
- Google Chrome, Xpert Learning Assistant in Bootcamp spot website and Chat GPT for providing insightful tutorials and resources.

## Contact

If you have any questions or suggestions, feel free to contact our team at:

- Jeff Kim
- Rinal Shastri
- Gursimran Kaur
- Thay Chansy
