var map = d3.geomap.choropleth()
    .geofile('static/d3-geomap-1.0.2/topojson/countries/USA.json')
    .projection(d3.geo.albersUsa)
    .column('2012')
    .unitId('fips')
    .scale(1000)
    .legend(true);

d3.csv('capital.csv', function(error, data) {
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
});