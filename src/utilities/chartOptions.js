const chartOptions = (onClick, config = {
  earnings: true
}) => {
  return {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let datasets = context.chart.config._config.data.datasets;
            datasets = datasets.map(dataset => dataset.data);

            if (config.earnings) {
              datasets.pop();

              if (context.datasetIndex === datasets.length) {
                return ` ${context.formattedValue} HNT`;
              }
            }

            let total = datasets.map(dataset => dataset[context.dataIndex]);
            total = total.reduce((a, b) => a + b, 0)
            const percentage = (parseInt(context.formattedValue, 10) / total) * 100;

            if (context.formattedValue !== '0') {
              return ` ${context.formattedValue}: ${percentage.toFixed(2)}%`;
            } else {
              return ` ${context.formattedValue}: 0%`;
            }
          }
        }
      },
      legend: {
        display: false
      },
      chartWatermark: true
    },
    scales: {
      dataAxis: {
        display: true,
        beginAtZero: true,
        stepValue: 1,
        ticks: {
          precision: 0
        },
        position: 'left',
        type: 'linear'
      },
      earningsAxis: {
        beginAtZero: true,
        display: config.earnings,
        position: 'right',
        type: 'linear',
        grid: {
          display: false
        }
      }
    },
    responsive: true,
    interaction: { mode: 'index', intersect: true },
    onClick
  };
};

export default chartOptions;
