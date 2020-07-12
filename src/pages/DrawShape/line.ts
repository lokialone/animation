import Rect from '../../shape/rect';
interface DestinationProp {
    to?: Rect;
    x?: number;
    y?: number;
}
export default class Line {
    from: Rect;
    to?: Rect;
    tmpX?: number;
    tmpY?: number;
    anchorIndex: number;
    x: number;
    y: number;
    constructor(from: Rect, to: Rect | undefined, x?: number, y?: number, anchorIndex = 0) {
        this.from = from;
        this.to = to;
        this.tmpX = x;
        this.tmpY = y;
        this.anchorIndex = anchorIndex;
        const anchor = this.from.getAnchors()[this.anchorIndex];
        this.x = anchor.x;
        this.y = anchor.y;
    }

    setDestination({to, x, y}: DestinationProp) {
        if (to) {
            this.to = to;
        }
        this.tmpX = x;
        this.tmpY = y;
    }
    drawTo(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.drawArrowLine(ctx, this.x, this.y, x, y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        let x = 0,
            y = 0;
        if (this.to) {
            x = this.to.x;
            y = this.to.y;
        } else if (this.tmpX !== undefined && this.tmpY !== undefined) {
            x = this.tmpX;
            y = this.tmpY;
        } else {
            throw '未指定终点';
        }
        this.drawArrowLine(ctx, this.x, this.y, x, y);
    }

    drawArrowLine(
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        theta = 30,
        headlen = 10,
        width = 1,
        color = '#000',
    ) {
        // 计算各角度和对应的P2,P3坐标
        const angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
            angle1 = ((angle + theta) * Math.PI) / 180,
            angle2 = ((angle - theta) * Math.PI) / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();

        let arrowX = fromX - topX,
            arrowY = fromY - topY;

        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        arrowX = toX + topX;
        arrowY = toY + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(toX, toY);
        arrowX = toX + botX;
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
    }
}
