export class Particle {
    orignX: number;
    orignY: number;
    size: number;
    ease: number;
    force: number;
    vx: number;
    vy: number;
    friction: number;
    constructor(public x: number, public y: number, public effect: Effect, public color: string) {
        this.orignX = x;
        this.orignY = y;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.effect = effect;
        this.size = effect.gap;
        this.ease = 0.06;
        this.color = color;
        this.force = 0;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
    }
    draw() {
        this.effect.ctx.fillStyle = this.color;
        this.effect.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        if (this.effect.mouseInfo) {
            const x0 = this.effect.mouseInfo.x;
            const y0 = this.effect.mouseInfo.y;
            const distance = Math.sqrt(Math.pow(x0 - this.x, 2) + Math.pow(y0 - this.y, 2));
            this.force = 80 / distance;
            if (distance < 80) {
                const angle = Math.atan2(y0 - this.y, x0 - this.x);
                const dx = Math.cos(angle);
                const dy = Math.sin(angle);
                this.vx -= dx * this.force;
                this.vy -= dy * this.force;
            }
        }
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx + (this.orignX - this.x) * this.ease;
        this.y += this.vy + (this.orignY - this.y) * this.ease;
    }
    print() {
        //
    }
    reset() {
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
    }
    blocks() {
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() > 0.5 ? 0 : this.effect.height;
    }
}

export class Effect {
    gap: number;
    particles: Particle[];
    width: number;
    height: number;
    mouseInfo?: {
        x: number;
        y: number;
    };
    offsetLeft: number;
    offsetTop: number;
    constructor(public ctx: CanvasRenderingContext2D) {
        this.gap = 3;
        this.particles = [];
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.offsetLeft = ctx.canvas.offsetLeft;
        this.offsetTop = ctx.canvas.offsetTop;
        this.init();
        window.addEventListener('mousemove', this.eventListener.bind(this));
    }
    eventListener(event: MouseEvent) {
        this.mouseInfo = {
            x: event.x - this.offsetLeft,
            y: event.y - this.offsetTop,
        };
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
    reset() {
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
    print() {
        this.particles.forEach(particle => {
            particle.print();
        });
    }
    blocks() {
        this.particles.forEach(particle => {
            particle.blocks();
        });
    }
    destroy() {
        window.removeEventListener('mousemove', this.eventListener);
    }
}
