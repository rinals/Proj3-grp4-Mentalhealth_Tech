# Project 3 Proposal

## Dataset: Mental Health in the Tech SurveyProject Overview
The State of Mental Health Awareness and Support in the Tech Workplace
This project focuses on understanding how mental health is perceived, supported, and managed in various work environments. It explores the extent of mental health challenges among employees, the availability of support systems, and the impact of workplace culture on mental health outcomes. The project also considers factors such as company size, region, and the presence of mental health policies to draw insights into the overall state of mental health in different workplaces.
Background: With increasing awareness of mental health issues, especially in high-stress industries like tech, it's critical to understand how these issues manifest and what factors exacerbate them.


## Project Team
Thay Chansy
Gursimran Kaur (Simran)
Jeff Kim
Rinal Shastri


## Type of Data
Survey Data: exploring the state of mental health awareness, support, and challenges in the workplace, capturing demographic details, employment information, and perceptions of mental health among employees.

Primary Source: The Mental Health in Tech Survey dataset from Kaggle. 


## Research Question
What are the key mental health challenges faced by tech workers, and how do employee comments highlight the influence of factors such as company size, demographics, location, and work type?


## Objectives
- Identify common mental health themes based on employee comments.
- Analyze correlations between workplace factors (like company size, leave policies, benefits) and mental health outcomes.
- Visualize and quantify key trends and issues related to mental health.
- Provide recommendations based on data insights to enhance mental health support in tech workplaces.
- Create a interesting presentation highlighting the analysis findings 


## Methodology

### Data Processing: 
- Create an ETL (Extract, Transform, Load) pipeline to clean and merge the data from a SQLite database for analysis. 
  
### Analysis Techniques: 
- Sentiment Analysis: TextBlob is used to analyze the sentiment of employee comments.
- Word Cloud Visualization: A WordCloud is generated to highlight key themes in negative comments.
- Correlation Analysis: The project explores correlations between workplace conditions and mental health outcomes via bar charts.
- Interactive Visualization: Altair is used to create an interactive chart that allows users to compare how certain factors (e.g., seeking help, leaving) vary across different mental health conditions.
  

## Tools and Technologies
- Programming Language: Python, HTML, SQL, and JavaScript (D3)
- Database: SQLite 
- Framework: Flask
- Libraries: Pandas, Numpy, Seaborn, Matplotlib, WordCloud, TextBlob, Altair, RegEx, and Counter 
- Software: Visual Studio Code and Power BI


## Expected Outcomes
- Mental Health Themes: Key words and phrases that are most frequently associated with negative experiences are identified.
- Correlation Findings: The analysis explores how different factors (such as company size, benefits, and leave policies) impact employees' mental health.
- Visualization Insights: The interactive charts provide a clear, user-friendly way to explore the impact of workplace factors on mental health.


## Conclusion
- Summary of Findings: A brief overview of the key findings from the analysis.
- Recommendations: Actionable steps for companies in the tech industry to improve mental health support based on the insights gathered.
  

## References 
Altair Documentation. (n.d.). Retrieved from https://altair-viz.github.io/gallery/index.html
Kaggle. (2023). Tech Employee Mental Health Surveys. Retrieved from [https://www.kaggle.com/](https://www.kaggle.com/) 
Mueller, A. (n.d.). WordCloud Documentation. Retrieved from https://amueller.github.io/word_cloud/ 
Loria, S. (n.d.). TextBlob: Simplified Text Processing. Retrieved from https://textblob.readthedocs.io/en/dev/ 
Waskom, M. (n.d.). Seaborn: Statistical Data Visualization. Retrieved from https://seaborn.pydata.org/tutorial/color_palettes.html 