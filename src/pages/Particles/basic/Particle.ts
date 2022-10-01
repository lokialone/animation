export class Particle {
    orignX: number;
    orignY: number;
    size: number;
    ease: number;
    constructor(public x: number, public y: number, public effect: Effect) {
        this.orignX = x;
        this.orignY = y;
        this.x = 0;
        this.y = 0;
        this.effect = effect;
        this.size = effect.gap;
        this.ease = 0.02;
    }
    draw() {
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
        this.gap = 4;
        this.particles = [];
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.init();
    }
    init() {
        for (let i = 0; i < 1000; i++) {
            const particle = new Particle(Math.random() * this.width, Math.random() * this.height, this);
            this.particles.push(particle);
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
