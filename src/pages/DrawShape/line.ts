import Rect from '../../shape/rect';
interface DestinationProp {
    to: Rect;
    anchorIndex: number;
}
export default class Line {
    from: Rect;
    to?: Rect;
    tmpX?: number;
    tmpY?: number;
    fromAnchorIndex: number;
    toAnchorIndex?: number;
    x: number;
    y: number;
    constructor(from: Rect, anchorIndex = 0) {
        this.from = from;
        this.fromAnchorIndex = anchorIndex;
        const anchor = this.from.getAnchors()[anchorIndex];
        this.x = anchor.x;
        this.y = anchor.y;
    }

    setDestination({to, anchorIndex}: DestinationProp) {
        this.to = to;
        this.toAnchorIndex = anchorIndex;
    }
    drawTo(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.drawArrowLine(ctx, this.x, this.y, x, y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        const anchor = this.from.getAnchors()[this.fromAnchorIndex || 0];
        const fromX = anchor.x;
        const fromY = anchor.y;
        let x = 0,
            y = 0;
        if (this.to) {
            const anchor = this.to.getAnchors()[this.toAnchorIndex || 0];
            x = anchor.x;
            y = anchor.y;
        } else {
            throw '未指定终点';
        }
        this.drawArrowLine(ctx, fromX, fromY, x, y);
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
