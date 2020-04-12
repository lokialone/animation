import {BoundRect} from '../types';
export default class Ball {
    public x: number;
    public y: number;
    public radius: number;
    public color: string;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public vx: number;
    public vy: number;
    public lineWidth: number;
    constructor(radius = 40, color = '#ffff00') {
        this.x = 0;
        this.y = 0;
        this.radius = radius;
        this.color = color;
        this.rotation = 0;
        this.scaleX = 1;
        this.vx = 0;
        this.vy = 0;
        this.scaleY = 1;
        this.lineWidth = 1;
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        if (this.lineWidth > 0) {
            ctx.stroke();
        }
        ctx.restore();
    }

    public getBounds(): BoundRect {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2,
        };
    }
}
