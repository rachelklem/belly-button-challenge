// Define json URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    console.log(data);
    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let metadataResult = metadata.filter(item => item.id === parseInt(sample));
    // console.log(metadataResult);
    let metadataValue = metadataResult[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");
 
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadataValue).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`)
    })
  }
)};

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {
    console.log(data);
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleResult = samples.filter(item => item.id === sample);
    // console.log(sampleResult);
    let sampleValue = sampleResult[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = sampleValue.otu_ids;
    let otuLabels = sampleValue.otu_labels;
    let sampleValues = sampleValue.sample_values;
    console.log(otuIDs, otuLabels, sampleValues);

    // Build a Bubble Chart
    let trace1 = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: ['rgb(255, 65, 54)'],
        opacity: [0.6],
        size: sampleValues
      }
    };

    let bubbleData = [trace1];
    
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
    };

    // Plot Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart of Top 10 
    let otuidSliced = otuIDs.slice(0,10).reverse();
    let samplevaluesSliced = sampleValues.slice(0,10).reverse();
    let outlabelsSliced = otuLabels.slice(0,10).reverse();
    console.log(outlabelsSliced, samplevaluesSliced, outlabelsSliced)

    let trace2 = {
      x: samplevaluesSliced,
      y: otuidSliced.map((id) => `OTU ${id}`),
      text: outlabelsSliced,
      type: 'bar',
      orientation: 'h',
    };

    let barData = [trace2];

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    // Plot Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  }
)};

// Function to run on page load
function init() {
  d3.json(url).then((data) => {
    console.log(data);
    // Get the names field
    let names = data.names;

    // Select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // List of sample names to populate the select options
    Object.values(names).forEach(item => {
      dropdown.append('option').text(item)
    });

    // Get the first sample from the list
    let selectedValue = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(selectedValue),
    buildCharts(selectedValue),
    init
  })
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  d3.selectAll("#selDataset").on("change", 
  buildMetadata(newSample),
  buildCharts(newSample),
  init
  )
};

// Initialize the dashboard
init();