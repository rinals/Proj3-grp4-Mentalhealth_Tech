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
    // Count occurrences
    const counts = data.reduce((acc, current) => {
        const key = current.mental_vs_physical;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    // Prepare data for Plotly
    const trace = {
        x: Object.keys(counts),
        y: Object.values(counts),
        type: 'bar'
    };

    const layout = {
        title: 'Mental vs Physical Count Plot',
        xaxis: { title: 'Response' },
        yaxis: { title: 'Count' }
    };

    // Display Plotly chart
    Plotly.newPlot('result', [trace], layout);
}

function displayMentalHealthComments(data) {
    // Prepare data for Plotly
    const trace = {
        x: data.map(item => item.Frequency),
        y: data.map(item => item.Word),
        type: 'bar',
        orientation: 'h' // Horizontal bar chart
    };

    const layout = {
        title: 'Mental Health Comments Frequency',
        xaxis: { title: 'Frequency' },
        yaxis: { title: 'Word' },
        height: 500, // Adjust the height of the plot
        margin: {
            l: 100, // Adjust the left margin to fit long labels
            r: 50,
            b: 50,
            t: 100,
            pad: 4
        }
    };

    // Display Plotly chart
    Plotly.newPlot('result', [trace], layout);
}
