export default class Ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
    lineWidth: number;
    constructor(radius = 40, color = '#ffff00') {
        this.x = 0;
        this.y = 0;
        this.radius = radius;
        this.color = color;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lineWidth = 1;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        if (this.lineWidth > 0) {
            ctx.stroke();
        } else {
            ctx.fill();
        }
        ctx.restore();
    }
}
