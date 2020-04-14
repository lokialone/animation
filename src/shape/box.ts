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
    constructor(width = 50, height = 50, color = '#ff0000') {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
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
}

export default Box;
