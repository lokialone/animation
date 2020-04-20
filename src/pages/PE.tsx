import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
interface Props {
    path?: string;
}

const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let cancelAnimationId = 0;
        const balls: Ball[] = [];
        const gravity = 0;
        const bounce = -1;
        const friction = 1;
        const ballNumbers = 10;
        function createBalls() {
            for (let i = 0; i < ballNumbers; i++) {
                const radius = Math.random() * 20 + 10;
                const ball = new Ball(radius);
                ball.mass = radius / 10;
                ball.x = Math.random() * canvas.width;
                ball.y = Math.random() * canvas.height;
                ball.vx = Math.random() * 16 - 5;
                ball.vy = Math.random() * 16 - 5;
                balls.push(ball);
            }
        }
        function checkBoundaries(ball: Ball) {
            if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.vx *= bounce;
            } else if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= bounce;
            }
            if (ball.y + ball.radius > canvas.height) {
                ball.y = canvas.height - ball.radius;
                ball.vy *= bounce;
            } else if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= bounce;
            }
        }

        function rotate(x: number, y: number, sin: number, cos: number, reverse: boolean) {
            return {
                x: reverse ? x * cos + y * sin : x * cos - y * sin,
                y: reverse ? y * cos - x * sin : y * cos + x * sin,
            };
        }

        function checkCollision(ball0: Ball, ball1: Ball) {
            const dx = ball1.x - ball0.x;
            const dy = ball1.y - ball0.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball0.radius + ball1.radius) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                // rotate coordinates
                const pos0 = {x: 0, y: 0};
                const pos1 = rotate(dx, dy, sin, cos, true);
                // rotate velocity
                const vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true);
                const vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);
                // calculate v0f v1f
                const vxTotal = vel0.x - vel1.x;
                vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) / (ball0.mass + ball1.mass);
                vel1.x = vxTotal + vel0.x;
                // to avoid overlap;
                const absV = Math.abs(vel0.x) + Math.abs(vel1.x);
                const overlap = ball0.radius + ball1.radius - Math.abs(pos0.x - pos1.x);
                pos0.x += (vel0.x / absV) * overlap;
                pos1.x += (vel1.x / absV) * overlap;
                // rotate back
                const pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
                const pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

                ball1.x = ball0.x + pos1F.x;
                ball1.y = ball0.y + pos1F.y;
                ball0.x = ball0.x + pos0F.x;
                ball0.y = ball0.y + pos0F.y;
                const vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
                const vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
                ball0.vx = vel0F.x;
                ball0.vy = vel0F.y;
                ball1.vx = vel1F.x;
                ball1.vy = vel1F.y;
            }
        }
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach((ball, index) => {
                ball.x += ball.vx;
                ball.y += ball.vy;
                checkBoundaries(ball);
                for (let i = index + 1; i < balls.length; i++) {
                    checkCollision(ball, balls[i]);
                }
                ball.draw(ctx);
            });
        }
        createBalls();
        draw();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
