function renderChart(globalData) {
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
          width: '100%', // Let the chart adapt to the container's width
          height: 200, // Fixed height
        };
  
        const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
        window.addEventListener('resize', () => chart.draw(data, options));

      }
    } else {
      console.log('No data available for rendering the chart.');
    }
  }
  
  function renderLineChart(lineData) {
    if(lineData.length > 1) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(lineData);

      var options = {
        title: 'Inventory Details',
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(data, options);
      window.addEventListener('resize', () => chart.draw(data, options));
    } 
    } else {
      console.log('No data available for rendering the chart.');

    }
  }