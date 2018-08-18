// Use d3.json to fetch the data
/*d3.json(`/metadata/${sample}`).then(function(data) {
    console.log("newdata", data);
});*/

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

        // Use Texas to build the initial plots
        const defaultState = state[0];
        buildCharts(defaultState);
    });
};

function buildCharts() {
    /*d3.json(`/states/${state}`).then(function(data) {
        console.log('state data', data);
        // Build line chart
        // Build bar chart
    });*/

    // Build map with static data from 2016
    d3.json(`/metadata/2016`).then(function(data) {
        console.log('2016 data',data)
    });
    
}

init();