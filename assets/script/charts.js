function renderChart() {
    if (globalData.length > 1) { // Ensure globalData contains rows (header + data)
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
  
      function drawChart() {
        const data = google.visualization.arrayToDataTable(globalData);
  
        const options = {
          legend: 'none',
          pieSliceText: 'label',
          title: 'Categories value',
          pieStartAngle: 100,
        };
  
        const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      }
    } else {
      console.log('No data available for rendering the chart.');
    }
  }
  