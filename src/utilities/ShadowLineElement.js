const ShadowLineElement = Chart.elements.Line.extend({
  draw () {
    const { ctx } = this._chart
    const originalStroke = ctx.stroke

    ctx.stroke = function () {
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,.3)'
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2
      originalStroke.apply(this, arguments)
      ctx.restore()
    }

    Chart.elements.Line.prototype.draw.apply(this, arguments)
    ctx.stroke = originalStroke;
  }
});

export default ShadowLineElement;
