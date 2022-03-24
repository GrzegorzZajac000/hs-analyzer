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

export default chartWatermark;
