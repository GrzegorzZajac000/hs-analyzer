const chartWatermark = {
  id: 'chart-watermark',
  afterDraw: chart => {
    if (!chart.config._config.options.plugins.chartWatermark) {
      return false;
    }

    const ctx = chart.ctx;
    const width = chart.chartArea.width;
    const height = chart.chartArea.height;

    ctx.globalAlpha = 0.75;

    ctx.font = 'normal normal 700 48px Lato, sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.textAlign = 'center';
    ctx.fillText('hs-analyzer.com', width / 2, height / 2);

    ctx.globalAlpha = 1;
  }
};

export default chartWatermark;
