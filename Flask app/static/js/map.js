

/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */


//Width and height of map
var width = 960;
var height = 500;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var toolTip = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);


// Load in my states data!
var marriageRatesAndStatesUrl = '/metadata/year/2016';
d3.json(marriageRatesAndStatesUrl, function(data) {
    console.log('state data', data);
    var marriage_rates = data.marriage_rates;
    var states = data.state;

    color.domain([0, 1, 2, 3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
    var usMapUrl = "https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json";
    d3.json(usMapUrl, function (json) {
        console.log('json state', json);
        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.states.length; i++) {

            // Grab State Name
            var dataState = data.states[i];

            // Grab data value
            var dataValue = data.marriage_rates[i];

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.marriage_rates = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {
                var value = d.properties.marriage_rates;

                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "rgb(213,222,217)";
                }
            })
            .on("mouseover", function(d) {
                toolTip.transition()
                    .duration(200)
                    .style("opacity", .9);
                toolTip.html(`<strong>${d.properties.name}</strong>
							<p>${d.properties.marriage_rates}</p>`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })

            // fade out tooltip on mouse out
            .on("mouseout", function(d) {
                toolTip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // var toolTip = d3.select("body").append("div")
        //     .attr("class", "tooltip");
        //
        // chartGroup.on("mouseover", function (d, i) {
        //     toolTip.style("display", "block");
        //     toolTip.html(`State: <strong>${marriage_rates[i]}</strong>`)
        //         .style("left", d3.event.pageX + "px")
        //         .style("top", d3.event.pageY + "px");
        // })
        // // Step 3: Add an onmouseout event to make the tooltip invisible
        //     .on("mouseout", function () {
        //         toolTip.style("display", "none");
        //     });


// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
		var legend = d3.select("body").append("svg")
			.attr("class", "legend")
			.attr("width", 140)
			.attr("height", 200)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d; });

    });
});