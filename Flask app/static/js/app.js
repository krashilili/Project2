// Use d3.json to fetch the data
/*d3.json(`/metadata/${sample}`).then(function(data) {
    console.log("newdata", data);
});*/

function init() {      

    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(`/metadata/`).then((state) => {
        state.forEach((instance) => {
        selector
            .append("option")
            .text(instance)
            .property("value", instance);
        });
    });
};

init();