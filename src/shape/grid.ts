export default class Grid {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private stepx: number;
    private stepy: number;
    rotation: number;
    color: string;
    border: boolean;
    constructor(x = 0, y = 0, stepx = 20, stepy = 20, width = 200, height = 200) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.rotation = 0;
        this.stepx = Math.floor(stepx);
        this.stepy = Math.floor(stepy);
        this.color = 'lightgray';
        this.border = true;
    }

    setStep(stepx: number, stepy: number) {
        this.stepx = Math.floor(stepx);
        this.stepy = Math.floor(stepy);
    }

    setPosition(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    setLimit(x: number, y: number) {
        this.width = Math.floor(x);
        this.height = Math.floor(y);
    }

    private drawRightBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.width - 0.5, this.y - 0.5);
        ctx.lineTo(this.width - 0.5, this.height - 0.5);
        ctx.stroke();
        ctx.closePath();
    }

    private drawLeftBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.x + 0.5, this.y + 0.5);
        ctx.lineTo(this.x + 0.5, this.height - 0.5);
        ctx.stroke();
        ctx.closePath();
    }

    private drawTopBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.x + 0.5, this.y + 0.5);
        ctx.lineTo(this.width - 0.5, this.y + 0.5);
        ctx.stroke();
        ctx.closePath();
    }

    private drawBottomBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.x + 0.5, this.height - 0.5);
        ctx.lineTo(this.width - 0.5, this.height - 0.5);
        ctx.stroke();
        ctx.closePath();
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.5;
        ctx.translate(this.x, this.y);

        for (let i = this.x + 0.5 + this.stepx; i <= this.width; i += this.stepx) {
            ctx.beginPath();
            ctx.moveTo(i, this.y);
            ctx.lineTo(i, this.height);
            ctx.stroke();
            ctx.closePath();
        }

        for (let i = this.y + 0.5 + this.stepy; i <= this.height; i += this.stepy) {
            ctx.beginPath();
            ctx.moveTo(this.x, i);
            ctx.lineTo(this.width, i);
            ctx.stroke();
            ctx.closePath();
        }

        if (this.border) {
            this.drawLeftBorder(ctx);
            this.drawTopBorder(ctx);
            this.drawRightBorder(ctx);
            this.drawBottomBorder(ctx);
        }
        ctx.restore();
    }
}
