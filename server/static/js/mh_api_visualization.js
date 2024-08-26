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
    else if (section === 'classified-comments-large-companies') {
        displayClassifiedThemesInCommentsForLargeCompanies(data);
    }
    else if (section === 'unclassified-comments-large-companies') {
        displayUnclassifiedThemesInCommentsForLargeCompanies(data);
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

function displayWordCloud(data) {
    const defaultStopwords = new Set(["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
        "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
        "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
        "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
        "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
        "should", "now", "else"]);

    const customStopwords = new Set([
        "month", "option", "past", "say", "many", "want", "need", "etc", "back", "things", "seen", "new",
        "small", "understand", "fo", "always", "program", "even", "thing", "reason", "very", "might",
        "currently", "really", "lot", "non", "large", "day", "get", "also", "way", "one", "yes", "180",
        "let", "said", "come", "see", "still", "based", "could", "may", "part", "much", "using", "add",
        "side", "two", "150", "use", "went", "got", "would", "know", "wasn"]);

    const allStopwords = new Set([...defaultStopwords, ...customStopwords]);

    // Function to process the text and remove stopwords
    function processText(text) {
        return text
            .toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 2 && !allStopwords.has(word));
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

    d3.layout.cloud()
        .size([800, 400])
        .words(words)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.size)
        .on("end", draw)
        .start();

    function draw(words) {
        const svg = d3.select("#result")
            .append("svg")
            .attr("width", 800)
            .attr("height", 400);

        const g = svg.append("g")
            .attr("transform", "translate(400,200)");

        g.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text);

        const bbox = g.node().getBBox();
        svg.attr("width", bbox.width + 10)
            .attr("height", bbox.height + 10);

        g.attr("transform", "translate(" + [(bbox.width / 2) + 10, (bbox.height / 2) + 10] + ")");
    }
}

function displayThemesInComments(data) {
    displayWordCloud(data)
}

function displayClassifiedThemesInCommentsForLargeCompanies(data) {
    displayWordCloud(data)
}

function displayUnclassifiedThemesInCommentsForLargeCompanies(data) {
    displayWordCloud(data)
}