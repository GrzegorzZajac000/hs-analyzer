const chartWatermark = {
  id: 'chart-watermark',
  afterDraw: chart => {
    if (!chart.config._config.options.plugins.chartWatermark) {
      return false;
    }

    const text = 'hs-analyzer.com';

    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;

    ctx.font = 'normal normal 700 36px Lato, sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';

    const textWidth = ctx.measureText(text).width;

    ctx.fillText(
      text,
      (width / 2) - (textWidth / 2),
      (height / 2) - (36 / 2)
    );
  }
};

export default chartWatermark;
