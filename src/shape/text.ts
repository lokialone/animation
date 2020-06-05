// import Point from './point';
interface TextOption {
    x: number;
    y: number;
    value: string;
}
class Text {
    x: number;
    y: number;
    value: string;
    // color?: string;
    public rotation: number;
    public scaleX: number;
    public scaleY: number;
    public lineWidth: number;
    constructor({x = 0, y = 0, value = ''}: TextOption) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lineWidth = 1;
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '20px Arial';
        // ctx.measureText(this.value);
        ctx.fillText(this.value, this.x, this.y);
        // ctx.strokeText(this.value, this.x, this.y);
        ctx.restore();
    }
}

export default Text;
