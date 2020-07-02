import Point from './point';
import Text from './text';
import Line from '../pages/DrawShape/line';
interface RectOption {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}
interface Edge {
    instance: Line;
    needDraw: boolean;
}
class Rect {
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    value?: string;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public vx: number;
    public vy: number;
    public lineWidth: number;
    public isHover: boolean;
    public anchorRadius: number;
    public edges?: Edge[];
    constructor({x = 0, y = 0, width = 50, height = 50, color = '#ff0000'}: RectOption) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lineWidth = 1;
        this.isHover = false;
        this.anchorRadius = 6;
    }
    public onHover(fn: Function) {
        this.setHoverState(true);
        fn();
    }
    public setContent(text: string) {
        this.value = text;
    }

    public setHoverState(state: boolean) {
        this.isHover = state;
    }

    public getAnchors() {
        return [
            {
                x: this.x + this.width / 2,
                y: this.y + this.height,
                r: this.anchorRadius,
            },
        ];
    }

    drawAnchor(ctx: CanvasRenderingContext2D) {
        if (!this.isHover) return;
        ctx.save();
        ctx.fillStyle = 'white';
        const anchors = this.getAnchors();
        ctx.beginPath();
        anchors.forEach(anchor => {
            ctx.arc(anchor.x, anchor.y, anchor.r, 0, Math.PI * 2, true);
        });
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    drawContent(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        console.log('this.value', this.value);
        ctx.strokeStyle = 'black';
        if (this.value) {
            const text = new Text({x: this.x + this.width / 2, y: this.y + this.height / 2, value: this.value});
            text.draw(ctx);
        }
        ctx.stroke();
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fill();
        if (this.lineWidth > 0) {
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    public stroke(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        if (this.isHover) {
            context.shadowColor = '#00ff00';
            context.shadowBlur = 10;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
        }
        context.stroke();
        context.restore();
        this.drawAnchor(context);
        this.drawContent(context);

        context.restore();
    }
    public getPoints() {
        const points: Point[] = [];
        points.push(new Point(this.x, this.y));
        points.push(new Point(this.x + this.width, this.y));
        points.push(new Point(this.x + this.width, this.y + this.height));
        points.push(new Point(this.x, this.y + this.height));
        return points;
    }
    public createPath(context: CanvasRenderingContext2D) {
        const points = this.getPoints();

        context.beginPath();

        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < 4; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.closePath();
    }
}

export default Rect;
