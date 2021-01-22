interface SpriteOption {
    loop: boolean,
    frameIndex: number,
    startFrameIndex: number,
    tickCount: number,
    ticksPerFrame: number,
    numberOfFrames: number,
    numberOfPerLine: number,
    width: number,
    height: number,
    sprite: HTMLImageElement,
    x: number;
    y: number;
}

export default class Sprite {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    options: SpriteOption;
    turnFlag: boolean;
    angle: number;
    speed: number;
    radiusX: number;
    radiusY :number;
    rotate: number;
    constructor(canvas: HTMLCanvasElement, opts: Partial<SpriteOption>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) throw Error('no context');
        if (!opts.sprite) throw Error('no SpriteImage');
        this.angle = 0;
        this.speed = 0.01;
        this.radiusX = 100;
        this.radiusY = 100;
        this.options = {
            loop: true,  // 是否循环播放
            frameIndex: 0,  // 当前第几帧
            startFrameIndex: 0, // 其实渲染位置
            tickCount: 0, // 每个时间段内计数器
            ticksPerFrame: opts.ticksPerFrame || 1, // 每个渲染时间段帧数，通过这个来控制动画的渲染速度
            numberOfFrames: opts.numberOfFrames || 1, // 动画总帧数
            numberOfPerLine: 1, // 每行动画帧数
            width: opts.width || 0, // 画布宽度
            height: opts.height || 0, // 画屏高度
            sprite: opts.sprite,
            x: opts.x || 100,
            y: opts.y || 100
        }
        this.rotate = 0;
        this.turnFlag = false;
        this.options.width = Math.min(this.canvas.width, this.options.sprite.width);
        this.options.height = Math.min(this.canvas.height, this.options.sprite.height);
        if (!this.options.numberOfPerLine) {
            this.options.numberOfPerLine = this.options.numberOfFrames || 9999;
        }
    }
    public render() {
        if (!this.ctx) throw Error('no context');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        const spriteWidth = this.options.sprite.width;
        const spriteHeight = this.options.sprite.height;
        const frameHeight = spriteHeight / this.options.numberOfFrames;
        this.ctx.translate(this.options.x + spriteWidth / 2, this.options.y + frameHeight / 2);
        if ((this.options.x + spriteWidth / 2 > this.canvas.width)&& !this.turnFlag) {
            this.turnFlag = true;
        }
        if(this.turnFlag) {
            this.ctx.rotate(this.rotate * Math.PI/180);
        }
        // 核心绘制代码，主要使用了 canvas.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) API
        this.ctx.drawImage(this.options.sprite, 
            0, this.options.frameIndex * frameHeight, spriteWidth, frameHeight , -this.options.x, -this.options.y, spriteWidth, frameHeight );
        this.ctx.restore();
    }
    public updateFrame() {
        this.options.tickCount++;
        if (this.options.tickCount > this.options.ticksPerFrame) {
            this.options.tickCount = 0;
            if (this.options.frameIndex < this.options.numberOfFrames - 1) {
                this.options.frameIndex++;
            } else if (this.options.loop) {
            this.options.frameIndex = this.options.startFrameIndex;
            }
        }
    }

    public beginTurn() {
        
    }

    public updatePostion() {
        // this.options.x++;
    }

    public update() {
        if (!this.ctx) throw Error('no context');
        this.rotate += 0.1;
        this.updatePostion();
        this.updateFrame();

        
    }
}
