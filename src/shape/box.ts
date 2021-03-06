import Point from './point';
interface BoxOption {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}
class Box {
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public vx: number;
    public vy: number;
    public lineWidth: number;
    constructor({x = 0, y = 0, width = 50, height = 50, color = '#ff0000'}: BoxOption) {
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
        ctx.closePath();
        if (this.lineWidth > 0) {
            ctx.stroke();
        }
        ctx.restore();
    }
    public stroke(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        // context.strokeStyle = this.strokeStyle;
        context.stroke();
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

export default Box;
