function buildCharts(state) {
    // TO DO: Iterate through all states
    d3.json(`/metadata/state/${state}`).then(function(stateData) {
        console.log(state);

        // Cast rates as numbers
        console.log('state data', stateData);
        
        // Part 2 - Adding attributes
	    var trace1 = {
            x: stateData.year,
            y: stateData.marriage_rates,
            type: "line"
            };
            var data = [trace1];
            var layout = {
            title: "Marriage Rates",
            xaxis: { title: "Year"},
            yaxis: { title: "Marriage Rate"}
        };
        
        Plotly.newPlot("#line", data, layout);
    });

    // Build map with static data from 2016
    d3.json(`/metadata/year/2016`).then(function(yearData) {
        console.log('2016 data', yearData)
    });
    
};

function init() {      

    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/states").then((state) => {
        state.forEach((instance) => {
        selector
            .append("option")
            .text(instance)
            .property("value", instance);
        });

        // Use Alabama to build the initial plot
        const defaultState = state[0];
        buildCharts(defaultState);
    });
};

function optionChanged(newState) {
    // Fetch new data each time a new state is selected
    buildCharts(newState);
}

init();