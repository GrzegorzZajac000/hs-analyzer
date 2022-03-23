import { Chart } from 'chart.js';

const chartWatermark = {
  id: 'chart-watermark',
  afterDraw: chart => {
    const ctx = chart.ctx;
    const width = chart.chartArea.width;

    ctx.globalAlpha = 0.75;

    ctx.font = 'normal normal 400 14px Lato, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText('hs-analyzer.com', width + 15, 30);

    ctx.globalAlpha = 1;
  }
};

Chart.register(chartWatermark);

const chartOptions = onClick => {
  return {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let datasets = context.chart.config._config.data.datasets;
            datasets = datasets.map(dataset => dataset.data);

            let total = datasets.map(dataset => dataset[context.dataIndex]);
            total = total.reduce((a, b) => a + b, 0)
            const percentage = (parseInt(context.formattedValue, 10) / total) * 100;

            if (context.formattedValue !== '0') {
              return `${context.formattedValue}: ${percentage.toFixed(2)}%`;
            } else {
              return `${context.formattedValue}: 0%`;
            }
          }
        }
      },
      legend: {
        display: false
      },
      chartWatermark
    },
    scale: {
      ticks: {
        precision: 0
      }
    },
    responsive: true,
    interaction: { mode: 'index', intersect: true },
    scales: { x: { stacked: true }, y: { stacked: true } },
    onClick
  };
};

export default chartOptions;

// tooltip
// itemSort: function(a, b) {
//   return b.datasetIndex - a.datasetIndex
// },
