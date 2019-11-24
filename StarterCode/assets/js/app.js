var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(demodata) {
   // parse data
    demodata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.poverty);
    });

// Initial Params
// function used for updating x-scale var upon click on axis label

  // create scales
  var xLinearScale = d3.scaleLinear()
     .domain([8.5, d3.max(demodata, d => d.poverty*1.2)])
     .range([0, width]);

  var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(demodata, d => d.healthcare*1.2)])
     .range([height,0]);


    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
    chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);


  // Create circles
  var circlesGroup = chartGroup.selectAll("circle").data(demodata).enter();
   circlesGroup.append("circle")
       .attr("cx", d => xLinearScale(d.poverty))
       .attr("cy", d => yLinearScale(d.healthcare))
       .attr("r", "15")
       .attr("fill", "blue")
       .attr("class","stateCircle")
       .attr("opacity", ".5")
       .on("click", function(data) {
         toolTip.show(data,this);
       });
   circlesGroup.append("text")
   .text(function(d){
     return d.abbr;
   })
     .attr("dx", d => xLinearScale(d.poverty))
     .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
     .attr("font-size","9")
     .attr("class","stateText")
     .on("mouseover", function(data, index) {
       toolTip.show(data,this);
     d3.select(this).style("stroke","#323232")
     })
     .on("mouseout", function(data, index) {
         toolTip.hide(data,this)
      d3.select(this).style("stroke","#e3e3e3")
     });
     chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);
   chartGroup.append("g")
     .call(leftAxis);

   // Initialize tool tip for d3
    var toolTip = d3.tip()
   .attr("class", "d3-tip")
   .offset([80, -20])
   .html(function(d) {
     return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
   });

   chartGroup.call(toolTip);

   // labels for y axis
   chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  // labels for x axis
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .classed("axis-text", true)
  .text("In Poverty (%)");

});



