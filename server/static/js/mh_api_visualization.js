function handleMenuClick(section) {
    // Display loading message
    document.getElementById('result').innerHTML = '<p></p>';

    const apiUrl = 'http://127.0.0.1:5000/' + section;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResult(section, data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('result').innerHTML = '<p>Error loading data.</p>';
        });
}

function displayResult(section, data) {

    if (section === 'mental-vs-physical') {
        displayMentalVsPhysicalPlot(data);
    }
    else if (section === 'mental-health-comments') {
        displayMentalHealthComments(data);
    }
    else if (section === 'themes-in-comments') {
        displayThemesInComments(data);
    }
    else {
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<h2>' + section.charAt(0).toUpperCase() + section.slice(1) + '</h2>';

        if (Array.isArray(data)) {
            let list = '<ul>';
            data.forEach(item => {
                list += '<li>' + JSON.stringify(item) + '</li>';
            });
            list += '</ul>';
            resultDiv.innerHTML += list;
        } else {
            resultDiv.innerHTML += '<p>' + JSON.stringify(data) + '</p>';
        }
    }
}

function displayMentalVsPhysicalPlot(data) {
    // Count the "Yes" responses for both mental_health_consequence and phys_health_consequence
    let mentalYesCount = 0;
    let physYesCount = 0;

    data.forEach(item => {
        if (item.mental_health_consequence === "Yes") {
            mentalYesCount++;
        }
        if (item.phys_health_consequence === "Yes") {
            physYesCount++;
        }
    });

    // Data for Plotly
    const trace = {
        x: ['Mental Health Consequence', 'Physical Health Consequence'],
        y: [mentalYesCount, physYesCount],
        type: 'bar',
        marker: {
            color: ['blue', 'green'] // Different colors for each bar
        }
    };

    const layout = {
        title: 'Mental and Physical Health Consequences',
        yaxis: {
            title: 'Count',
            range: [0, Math.max(mentalYesCount, physYesCount) + 5] // Adding some padding to the y-axis
        }
    };

    // Render the plot
    Plotly.newPlot('result', [trace], layout);
}

function displayMentalHealthComments(data) {

    const classificationColors = {
        "Both": "#2ca02c", //           Green
        "Unclassified": "#ff7f0e", //   Orange
        "Depression": "#1f77b4", //     Blue
        "Anxiety": "#d62728" //         Red
    };

    // Map colors to the classifications
    const customColors = data.map(item => classificationColors[item.Classification] || '#d62728');

    // Prepare data for Plotly
    const trace = {
        x: data.map(item => item.Percentage),
        y: data.map(item => item.Classification),
        type: 'bar',
        orientation: 'h', // Horizontal bar chart
        marker: {
            color: customColors // Use the custom color palette
        }
    };

    const layout = {
        title: 'Mental Health Conditions Highlighted in Comments',
        xaxis: {
            title: 'Percentage (%)'
        },
        yaxis: {
        }
    };

    // Display Plotly chart
    Plotly.newPlot('result', [trace], layout);
}

function displayThemesInComments(data) {
    const customStopwords = new Set([
        "month", "option", "past", "say", "many", "want", "need", "etc", "back", "things", "seen", "new", 
        "small", "understand", "fo", "always", "program", "even", "thing", "reason", "very", "might", 
        "currently", "really", "lot", "non", "large", "day"
    ]);

    // Function to process the text and remove stopwords
    function processText(text) {
        return text
            .toLowerCase()
            .split(/\W+/) // Split on non-word characters
            .filter(word => word.length > 2 && !customStopwords.has(word)); // Filter out short words and stopwords
    }

    // Create a map of word frequencies
    const wordFrequency = data
        .flatMap(entry => processText(entry.comments))
        .reduce((freq, word) => {
            freq[word] = (freq[word] || 0) + 1;
            return freq;
        }, {});

    // Convert the word frequency map into an array
    const words = Object.keys(wordFrequency).map(word => ({ text: word, size: wordFrequency[word] * 10 }));

    // Set up the word cloud layout
    d3.layout.cloud()
        .size([800, 600])
        .words(words)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.size)
        .on("end", draw)
        .start();

    // Draw the word cloud
    function draw(words) {
        d3.select("#result")
            .append("svg")
            .attr("width", 800)
            .attr("height", 600)
            .append("g")
            .attr("transform", "translate(400,300)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text);
    }
}
