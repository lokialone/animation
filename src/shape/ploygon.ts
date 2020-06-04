import Point from './point';
interface PolygonOptions {
    x: number;
    y: number;
    radius: number;
    sides: number;
}
class Polygon {
    x: number;
    y: number;
    radius: number;
    sides: number;
    startAngle: number;
    strokeStyle: string;
    fillStyle: string;
    filled: boolean;
    constructor({x, y, radius, sides}: PolygonOptions) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sides = sides;
        this.startAngle = 0;
        this.strokeStyle = '#000';
        this.fillStyle = '#000';
        this.filled = true;
    }
    private getPoints() {
        const points: Point[] = [];
        let angle = this.startAngle;

        for (let i = 0; i < this.sides; ++i) {
            points.push(new Point(this.x + this.radius * Math.sin(angle), this.y - this.radius * Math.cos(angle)));
            angle += (2 * Math.PI) / this.sides;
        }
        return points;
    }
    public createPath(context: CanvasRenderingContext2D) {
        const points = this.getPoints();

        context.beginPath();

        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < this.sides; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.closePath();
    }
    public stroke(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.restore();
    }

    public fill(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    }
    public move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default Polygon;
