# Proj3-grp4-Mentalhealth_Tech

## FLASK Server
server/mental_health_app.py
This flask app exposes the JSON API.
Each API function returns relevant data that the client can use for plotting etc.

Each API function handles one query e.g.:
1. /mental-vs-physical
2. //mental-health-comments

## Client
client/mental_health_dashboard.html
Menu on the left invokes javascript functions for each menu item.
the function handleMenuClick gets the name of the menu item as variable 'section'.
This 'section' is used to query the JSON API.
The received JSON is then used to plot graphs using plotly



## HOW TO RUN
### Start Server
#### Install flask
pip install flask
pip install flask_cors

#### Run server
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

#### Make sure you see something like this
Running on http://127.0.0.1:5000
This address is important and is used in the client when making API requests
e.g. const apiUrl = 'http://127.0.0.1:5000/' + section;