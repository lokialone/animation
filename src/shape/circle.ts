import {BoundRect} from '../types';
import Text from './text';
interface CircleOption {
    x: number;
    y: number;
    radius: number;
}
export default class Circle {
    public x: number;
    public y: number;
    public radius: number;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public vx: number;
    public vy: number;
    public lineWidth: number;
    public mass: number;
    public visible: boolean;
    public endX: number;
    public endY: number;
    value?: string;
    constructor({x, y, radius}: CircleOption) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rotation = 0;
        this.scaleX = 1;
        this.vx = 0;
        this.vy = 0;
        this.scaleY = 1;
        this.mass = 1;
        this.lineWidth = 1;
        this.endX = 0;
        this.endY = 0;
        this.visible = true;
    }

    public setContent(text: string) {
        this.value = text;
    }

    drawContent(ctx: CanvasRenderingContext2D) {
        if (this.value) {
            const text = new Text({x: this.x, y: this.y, value: this.value});
            text.draw(ctx);
        }
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        if (this.lineWidth > 0) {
            ctx.stroke();
        }
        ctx.restore();
    }

    public stroke(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.createPath(ctx);
        ctx.stroke();
        ctx.restore();
    }

    public createPath(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
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
