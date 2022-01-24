function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(participantID) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let samplesFiltered = samples.filter(s => participantID == s.id);
    //  5. Create a variable that holds the first sample in the array.
    let participantSample = samplesFiltered[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = participantSample.otu_ids;
    let otuLabels = participantSample.otu_labels;
    let sampleValues = participantSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // assuming otuIDs are stated in order of values because we don't want to sort all 3 by one array
    let yticks = otuIDs.slice(0,10).map(o => `OTU ${o}`).reverse();
    let xValues = sampleValues.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    let barData = [
    {
      x: xValues,
      y: yticks,
      type: 'bar',
      orientation: 'h'
    }
    ];
    // 9. Create the layout for the bar chart. 
    let barLayout = {
     title: 'Top 10 Bacteria Cultures Found'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Bubble Chart - Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
    {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: 'Earth',
          opacity: 0.8
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Quantity Present'},
      height: 600,
      width: 1180,
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  
    // Gauge Chart - Deliverable 3
    // Create a variable that holds the metadata array. 
    let mdata = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let mdataFiltered = mdata.filter(m => participantID == m.id);
    // 2. Create a variable that holds the first sample in the metadata array.
    let mdataPoint = mdataFiltered[0];
    // 3. Create a variable that holds the washing frequency.
    let washFrequency = mdataPoint.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        // domain: {x: [0, 1], y: [0,1]},
        value: washFrequency,
        type: 'indicator',
        mode: 'gauge+number',
        title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week'},
        gauge: {
          axis: {range: [null, 10]},
          steps: [
            {range: [0, 2], color: 'red'},
            {range: [2, 4], color: 'orange'},
            {range: [4, 6], color: 'yellow'},
            {range: [6, 8], color: 'yellowgreen'},
            {range: [8, 10], color: 'green'}
          ],
          bar: {color: 'black'}
        }
      }
     ];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 498.35,
      height: 500 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}




