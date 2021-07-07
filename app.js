// read json file
d3.json("data/samples.json").then((bbData) => {
    window.bbData = bbData;
    console.log(bbData);
    var data = bbData;
  
    // dropdown
    var idList = data.names;
    for (var i = 0; i < idList.length; i++) {
      selectBox = d3.select("#selDataset");
      selectBox.append("option").text(idList[i]);
    }
  
    // default
    updatePlots(0)
  
       
    function updatePlots(index) {
  
  
      // arrays
      var sampleSubjectOTUs = data.samples[index].otu_ids;
      var sampleSubjectFreq = data.samples[index].sample_values;
      var otuLabels = data.samples[index].otu_labels;
  
      var washFrequency = data.metadata[+index].wfreq;
      
  
  
      // demograph
      var demoKeys = Object.keys(data.metadata[index]);
      var demoValues = Object.values(data.metadata[index])
      var demographicData = d3.select('#sample-metadata');
  
      // clear data
      demographicData.html("");
  
      for (var i = 0; i < demoKeys.length; i++) {
  
        demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
      };
  
  
      // horizontal bar data
      var topTenOTU = sampleSubjectOTUs.slice(0, 10).reverse();
      var topTenFreq = sampleSubjectFreq.slice(0, 10).reverse();
      var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
      var topTenLabels = topTenOTU.map((otu => "OTU " + otu));
      var newLabels = topTenLabels.reverse();
  
      // trace
      var trace1 = {
        x: topTenFreq,
        y: newLabels,
        text: topTenToolTips,
        type: "bar",
        orientation: "h"
      };
  
      // data
      var barData = [trace1];
  
      // layout
      var layout = {
        title: "Top 10 Operational Taxonomic Units (OTUs)",
        };
  
      // plot bar graph
      Plotly.newPlot("bar", barData, layout);
  
      // Set up trace
      trace2 = {
        x: sampleSubjectOTUs,
        y: sampleSubjectFreq,
        text: otuLabels,
        mode: 'markers',
        
        marker: {
           size: sampleSubjectFreq
        }
      }
  
      //data for bubble
      var bubbleData = [trace2];
  
      // layout
      var layout = {
        title: 'Operational Taxonomic Units (OTU) Frequency',
        showlegend: false,
     }
  
      // plot bubble plot
      Plotly.newPlot("bubble", bubbleData, layout)
  
      // Gauge chart
  
      var trace3 = [{
        domain: {x: [0, 1], y: [0,1]},
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washes Per Week: Scrubs per Week"},
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#4ca153" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#dce8e1" },
            { range: [1, 2], color: "#cae0d2" },
            { range: [2, 3], color: "#a0ded8" },
            { range: [3, 4], color: "#90ded7" },
            { range: [4, 5], color: "#60d1c7" },
            { range: [5, 6], color: "#59c2b9" },
            { range: [6, 7], color: "#55b5ad" },
            { range: [7, 8], color: "#50aba3" },
            { range: [8, 9], color: "#4ca19a" }
  
          ],
        }
      }];
  
      gaugeData = trace3;
  
      var layout = {
        width: 500,
        height: 500,
        };
  
      Plotly.newPlot("gauge", gaugeData, layout);
  
    }
  
    // On button click, call refreshData()
    d3.selectAll("#selDataset").on("change", refreshData);
  
  
  
    function refreshData() {
      var dropdownMenu = d3.select("#selDataset");
      
      var personsID = dropdownMenu.property("value");
     
  
      for (var i = 0; i < data.names.length; i++) {
        if (personsID === data.names[i]) {
          updatePlots(i);
          return
        }
      }
    }
  
  });