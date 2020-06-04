function drawHorizontalLine(ctx: CanvasRenderingContext2D, y: number) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(ctx.canvas.width, y + 0.5);
    ctx.stroke();
    ctx.closePath();
}
function drawVerticalLine(ctx: CanvasRenderingContext2D, x: number) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, ctx.canvas.height);
    ctx.stroke();
    ctx.closePath();
}
function drawGuideLines(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,230,0.4)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([1, 1]);
    drawVerticalLine(ctx, x);
    drawHorizontalLine(ctx, y);
    ctx.restore();
}

export default drawGuideLines;
