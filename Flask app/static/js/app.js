function buildCharts(state) {
    // TO DO: Iterate through all states
    d3.json(`/metadata/state/${state}`).then(function(stateData) {
        // Log data from selected state
        console.log(state)
        console.log('state data', stateData);
        
        // Build line chart
	    var trace1 = {
            x: stateData.year,
            y: stateData.marriage_rates,
            type: "line"
            };
            var data = [trace1];
            var layout = {
            title: `${state} Marriage Rates`,
            xaxis: { title: "Year"},
            yaxis: { title: "Marriage Rate"}
        };
        Plotly.newPlot("line", data, layout);        
    });

    // Build map with static data from 2016
    d3.json(`/metadata/year/2016`).then(function(yearData) {
        console.log('Year data', yearData)

        // Build bar chart
        var trace2 = {
            x: yearData.states,
            y: yearData.marriage_rates,
            type: "bar"
            };
            var data = [trace2];
            var layout = {
            title: "2016 Marriage Rates",
            xaxis: { title: "State"},
            yaxis: { title: "Marriage Rate"}
        };
        Plotly.newPlot("bar", data, layout);
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