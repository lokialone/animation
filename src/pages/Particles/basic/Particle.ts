export class Particle {
    orignX: number;
    orignY: number;
    size: number;
    ease: number;
    constructor(public x: number, public y: number, public effect: Effect, public color: string) {
        this.orignX = x;
        this.orignY = y;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.effect = effect;
        this.size = effect.gap;
        this.ease = 0.04;
        this.color = color;
    }
    draw() {
        this.effect.ctx.fillStyle = this.color;
        this.effect.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        this.x += (this.orignX - this.x) * this.ease;
        this.y += (this.orignY - this.y) * this.ease;
    }
}

export class Effect {
    gap: number;
    particles: Particle[];
    width: number;
    height: number;
    constructor(public ctx: CanvasRenderingContext2D) {
        this.gap = 3;
        this.particles = [];
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.init();
    }
    init() {
        const image = document.getElementById('fish');
        this.ctx.drawImage(image as HTMLImageElement, this.width / 2 - 150, this.height / 2 - 150, 300, 300);
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < this.height; i += this.gap) {
            for (let j = 0; j < this.width; j += this.gap) {
                const index = (this.width * i + j) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const a = imageData.data[index + 3];
                if (a) {
                    const color = `rgb(
                        ${r},
                        ${g},
                        ${b})`;
                    this.particles.push(new Particle(j, i, this, color));
                }
            }
        }
    }
    draw() {
        this.particles.forEach(particle => {
            particle.draw();
        });
    }
    update() {
        this.particles.forEach(particle => {
            particle.update();
        });
    }
}
