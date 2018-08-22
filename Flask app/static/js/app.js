function buildCharts() {
    // TO DO: Iterate through all states
    d3.json(`/metadata/state/${state}`).then(function(stateData) {
        
        // Cast rates as numbers
        console.log('state data', stateData);

        // Build line chart
        // Define SVG area dimensions
		var svgWidth = 960;
		var svgHeight = 500;
		
		// Define the chart's margins as an object
		var margin = {
			top: 60,
			right: 60,
			bottom: 60,
			left: 60
		};
		
		// Define dimensions of the chart area
		var chartWidth = svgWidth - margin.left - margin.right;
        var chartHeight = svgHeight - margin.top - margin.bottom;

        // Select body, append SVG area to it, and set its dimensions
		var svg = d3.select("#line")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        
        // Append a group area, then set its margins
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Configure a time scale
		// d3.extent returns the an array containing the min and max values for the property specified
		var xLinearScale = d3.scaleTime()
            .domain(d3.extent(stateData, data => data.year))
            .range([0, chartWidth]);

        // Configure a linear scale with a range between the chartHeight and 0
		var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, data => data.marriage_rates)])
            .range([chartHeight, 0]);

        // Create two new functions passing the scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Configure a line function which will plot the x and y coordinates using our scales
		var drawLine = d3.line()
            .x(data => xLinearScale(data.year))
            .y(data => yLinearScale(data.marriage_rates));

        // Append an SVG path and plot its points using the line function
		chartGroup.append("path")
		// The drawLine function returns the instructions for creating the line for forceData
			.attr("d", drawLine(stateData))
            .classed("line", true);

        // Append an SVG group element to the chartGroup, create the left axis inside of it
		chartGroup.append("g")
            .classed("axis", true)
            .call(leftAxis);

        // Append an SVG group element to the chartGroup, create the bottom axis inside of it
		// Translate the bottom axis to the bottom of the page
		chartGroup.append("g")
            .classed("axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
            
        /*// Build bar chart
        // Select bar, append SVG area to it, and set the dimensions
        var svg = d3.select("#bar")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

        // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
        var xBandScale = d3.scaleBand()
		    .domain(stateData.map(d => d.name))
		    .range([0, chartWidth])
            .padding(0.1);*/
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

function optionChanged(newSample) {
    // Fetch new data each time a new state is selected
    buildCharts(newSample);
}

init();