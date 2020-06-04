import {BoundRect} from '../types';
export default class Line {
    public x: number;
    public y: number;
    public x1: number;
    public x2: number;
    public y1: number;
    public y2: number;
    public color: string;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public vx: number;
    public vy: number;
    public lineWidth: number;
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        this.x = 0;
        this.y = 0;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.rotation = 0;
        this.scaleX = 1;
        this.vx = 0;
        this.vy = 0;
        this.scaleY = 1;
        this.color = 'black';
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
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    public getBounds(): BoundRect {
        if (this.rotation === 0) {
            const minX = Math.min(this.x1, this.x2);
            const minY = Math.min(this.y1, this.y2);
            const maxX = Math.max(this.x1, this.x2);
            const maxY = Math.max(this.y1, this.y2);
            return {
                x: this.x + minX,
                y: this.y + minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        } else {
            const sin = Math.sin(this.rotation);
            const cos = Math.cos(this.rotation);
            const x1r = this.x1 * cos - this.y1 * sin;
            const y1r = this.y1 * cos + this.x1 * sin;
            const x2r = this.x2 * cos - this.y2 * sin;
            const y2r = this.y2 * cos + this.x2 * sin;
            return {
                x: this.x + Math.min(x1r, x2r),
                y: this.y + Math.min(y1r, y2r),
                width: Math.max(x1r, x2r) - Math.min(x1r, x2r),
                height: Math.max(y1r, y2r) - Math.min(y1r, y2r),
            };
        }
        // return {};
    }
}
