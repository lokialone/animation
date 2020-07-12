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
                y: this.y,
                r: this.anchorRadius,
            },
            {
                x: this.x + this.width,
                y: this.y + this.height / 2,
                r: this.anchorRadius,
            },
            {
                x: this.x + this.width / 2,
                y: this.y + this.height,
                r: this.anchorRadius,
            },
            {
                x: this.x,
                y: this.y + this.height / 2,
                r: this.anchorRadius,
            },
        ];
    }

    drawAnchor(ctx: CanvasRenderingContext2D) {
        if (!this.isHover) return;
        ctx.save();
        ctx.fillStyle = 'white';
        const anchors = this.getAnchors();

        anchors.forEach(anchor => {
            ctx.beginPath();
            ctx.arc(anchor.x, anchor.y, anchor.r, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        });

        ctx.restore();
    }

    drawContent(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
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
        // this.creatHoverPath(context);
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
    //包含锚点的路径绘制
    // public creatHoverPath(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath();
    //     ctx.moveTo(this.x, this.y);
    //     //top
    //     ctx.lineTo(this.x + this.width / 2 - this.anchorRadius, this.y);
    //     ctx.arc(this.x + this.width / 2, this.y, this.anchorRadius, Math.PI, 0, false);
    //     ctx.moveTo(this.x + this.width / 2 + this.anchorRadius, this.y);
    //     ctx.lineTo(this.x + this.width, this.y);
    //     // right
    //     ctx.lineTo(this.x + this.width, this.y + this.height / 2 - this.anchorRadius);
    //     ctx.arc(
    //         this.x + this.width,
    //         this.y + this.height / 2,
    //         this.anchorRadius,
    //         (3 * Math.PI) / 2,
    //         Math.PI / 2,
    //         false,
    //     );
    //     ctx.lineTo(this.x + this.width, this.y + this.height);
    //     // bottom
    //     ctx.lineTo(this.x + this.width / 2 + this.anchorRadius, this.y + this.height);
    //     ctx.arc(this.x + this.width / 2, this.y + this.height, this.anchorRadius, Math.PI * 2, Math.PI, false);
    //     ctx.lineTo(this.x, this.y + this.height);
    //     // left
    //     ctx.lineTo(this.x, this.y + this.height / 2 + this.anchorRadius);
    //     ctx.arc(this.x, this.y + this.height / 2, this.anchorRadius, (Math.PI * 1) / 2, (3 * Math.PI) / 2, false);
    //     ctx.lineTo(this.x, this.y);
    // }

    public isIntersecting(context: CanvasRenderingContext2D, x: number, y: number) {
        this.createPath(context);

        if (!this.isHover) {
            if (context.isPointInPath(x, y)) {
                return {
                    isIntersecting: true,
                    isInBody: true,
                    isInAchor: false,
                    anchorIndex: 0,
                };
            }
            return {
                isIntersecting: false,
                isInBody: false,
                isInAchor: false,
                anchorIndex: 0,
            };
        } else {
            const anchors = this.getAnchors();
            for (let i = 0; i < anchors.length; i++) {
                const anchor = anchors[i];
                if (Math.sqrt(Math.pow(x - anchor.x, 2) + Math.pow(y - anchor.y, 2)) < anchor.r) {
                    return {
                        isIntersecting: true,
                        isInBody: false,
                        isInAchor: true,
                        anchorIndex: i,
                    };
                }
            }
            if (context.isPointInPath(x, y)) {
                return {
                    isIntersecting: true,
                    isInBody: true,
                    isInAchor: false,
                    anchorIndex: 0,
                };
            }
        }

        return {
            isIntersecting: false,
            isInBody: false,
            isInAchor: false,
            anchorIndex: 0,
        };
    }
}

export default Rect;
