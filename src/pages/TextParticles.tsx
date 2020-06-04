import React, {useState, useRef, useEffect} from 'react';
import Ball from '../shape/ball';
import {Subject} from 'rxjs';
import {filter, map, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import raf from 'raf';
interface Props {
    path?: string;
}

const input$ = new Subject<React.KeyboardEvent<HTMLInputElement>>();

const TextParticles = (text: string, ctx: CanvasRenderingContext2D) => {
    let balls: Ball[] = [];
    function createBalls() {
        balls = [];
        ctx.save();
        ctx.font = '128px Helvetica';
        ctx.fillStyle = 'blue';
        ctx.textBaseline = 'top';
        ctx.fillText(text, 0, 0);
        const imageInfo = ctx.measureText(text);
        ctx.restore();
        const imageWidth = Math.ceil(imageInfo.width);
        const imageHeight = Math.ceil(imageInfo.actualBoundingBoxDescent);
        if (imageWidth <= 0 || imageHeight <= 0) return;
        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
        const pixels = imageData.data;
        for (let y = 0; y < imageHeight; y += 10) {
            for (let x = 0; x < imageWidth; x += 10) {
                const off = (y * imageWidth + x) * 4;
                if (pixels[off + 2]) {
                    const ball = new Ball(Math.random() * 2 + 4, `hsl(${Math.ceil(Math.random() * 100)}, 100%, 60%)`);
                    ball.x = Math.random() * ctx.canvas.width;
                    ball.y = Math.random() * ctx.canvas.width;
                    ball.endX = x;
                    ball.endY = y;
                    balls.push(ball);
                }
            }
        }
        return balls;
    }

    function render() {
        balls.forEach(ball => {
            if (Math.abs(ball.x - ball.endX) < 1 && Math.abs(ball.y - ball.endY) < 1) {
                ball.vx = Math.random() * 0.2 - 0.1;
                ball.vy = Math.random() * 0.2 - 0.1;
                ball.x += ball.vx;
                ball.y += ball.vy;
            } else {
                ball.vx = (ball.endX - ball.x) * 0.02;
                ball.vy = (ball.endY - ball.y) * 0.02;
                ball.x += ball.vx;
                ball.y += ball.vy;
            }

            ball.draw(ctx);
        });
    }

    createBalls();
    return {render};
};
const TextParticlesWrap = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [displayValue, setDisplayValue] = useState('你好');
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let cancelAnimationId = 0;
        let textParticles = TextParticles(displayValue, ctx);
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            textParticles.render();
        }
        const inputOnchange$ = input$.pipe(filter(e => e.key === 'Enter')).subscribe(e => {
            window.cancelAnimationFrame(cancelAnimationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            textParticles = TextParticles((e as any).target.value, ctx);
            draw();
        });
        draw();
        return () => {
            inputOnchange$.unsubscribe();
            window.cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>
                <input
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        setDisplayValue(e.target.value);
                    }}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => input$.next(e)}
                    value={displayValue}
                />
                回车触发修改
            </div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default TextParticlesWrap;
