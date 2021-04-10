var options = {
    series: [{
    name: 'Unit Consumption',
    type: 'column',
    data: [0.4, 1.2, ]
  }, {
    name: 'Fee',
    type: 'line',
    data: [2.4, 3.2, 4.5, 3.5, 1.6, 1.4]
  },
  {
    name: 'Expected Units',
    type: 'column',
    data: [0, 0,2.5, 1.5, 0.6,.4]
  }],
    chart: {
    height: 330,
    type: 'line',
    stacked: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [1, 5]
  },
  title: {
    text: 'Current Consumption',
    align: 'left',
    offsetX: 0
  },
  xaxis: {
    categories: ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sept-Oct", "Nov-Dec"],
    title: {
      text: "Time",
      color: "#008FFB"
    }
  },
  yaxis: [
    {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#008FFB'
      },
      labels: {
        style: {
          colors: '#008FFB',
        }
      },
      title: {
        text: "Units Consumed",
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    },
  ],
  tooltip: {
    fixed: {
      enabled: false,
      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
      offsetY: 30,
      offsetX: 60
    },
  },
  legend: {
    horizontalAlign: 'left',
    offsetX: 40
  }
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
