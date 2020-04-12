import React, {useEffect, useRef} from 'react';
import colors from 'nice-color-palettes';
import raf from 'raf';
import Ball from '../shape/ball';
interface Props {
    path?: string;
}
const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        const canvas = canvasRef?.current;
        const balls: Ball[] = [];
        const ballNumbers = 2;
        const friction = 0.1;
        const gravity = 0.5;
        for (let i = 0; i < ballNumbers; i++) {
            const ball = new Ball(20, colors[0][i % 5]);
            ball.x = Math.random() * canvas.width;
            ball.y = (Math.random() * canvas.height) / 2;
            ball.vx = Math.random() * 4 - 2;
            ball.vy = Math.random() * 10 - 10;
            balls.push(ball);
        }
        function draw(ball: Ball): void {
            if (!ctx) return;
            ball.vy += gravity;

            let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            const angle = Math.atan2(ball.vy, ball.vx);
            if (speed > friction) {
                speed -= friction;
            } else {
                speed = 0;
            }
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            ball.x += ball.vx;
            ball.y += ball.vy;
            if (ball.y + ball.radius > canvas.height) {
                ball.y = canvas.height - ball.radius;
                ball.vy *= -1;
            } else if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= -1;
            }

            if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.vx *= -1;
            } else if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
            }
            ball.draw(ctx);
        }
        function drawFrame() {
            if (!ctx) return;
            raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(draw);
        }
        drawFrame();
    }, []);
    return (
        <>
            <canvas ref={canvasRef} width={800} height={650} style={{border: '1px solid yellow'}}></canvas>
        </>
    );
};

export default Home;
