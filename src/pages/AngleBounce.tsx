import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import Line from '../shape/line';
import Box from '../shape/box';
import {captureMouse, intersects} from '../utils';
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
        const ball = new Ball(30);
        const line = new Line(0, 0, 300, 0);
        const gravity = 0.2;
        const bounce = -0.6;
        const friction = 1;
        const mouse = captureMouse(canvas);
        ball.x = 100;
        ball.y = 100;
        line.x = 50;
        line.y = 500;

        function checkBoundaries(ball: Ball) {
            const right = canvas.width;
            const top = 0;
            const left = 0;
            const bottom = canvas.height;
            ball.vy += gravity;
            ball.vx *= friction;
            ball.vy *= friction;
            ball.x += ball.vx;
            ball.y += ball.vy;
            //boundary detect and bounce
            if (ball.x + ball.radius > right) {
                ball.x = right - ball.radius;
                ball.vx *= bounce;
            } else if (ball.x - ball.radius < left) {
                ball.x = left + ball.radius;
                ball.vx *= bounce;
            }
            if (ball.y + ball.radius > bottom) {
                // ball.y = top + ball.radius;
                // ball.x = 100;
                ball.y = bottom - ball.radius;
                ball.vy *= bounce;
            } else if (ball.y - ball.radius < top) {
                ball.y = top + ball.radius;
                ball.vy *= bounce;
            }
        }
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            line.rotation = ((mouse.y - line.y) * 0.1 * Math.PI) / 180;
            const cos = Math.cos(line.rotation);
            const sin = Math.sin(line.rotation);
            const bounds = line.getBounds();
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;

            // intersects(ball.getBounds(), line.getBounds()) 简单判断
            if (ball.x + ball.radius > bounds.x && ball.x - ball.radius < bounds.x + bounds.width) {
                let x1 = ball.x - line.x;
                let y1 = ball.y - line.y;
                // rotate coordinates
                const x2 = x1 * cos + y1 * sin;
                let y2 = y1 * cos - x1 * sin;
                const vx1 = ball.vx * cos + ball.vy * sin;
                let vy1 = ball.vy * cos - ball.vx * sin;
                if (y2 > -ball.radius && y2 < vy1) {
                    y2 = -ball.radius;
                    // rotate velocity

                    vy1 *= bounce;
                    // rotate everything back;
                    x1 = x2 * cos - y2 * sin;
                    y1 = y2 * cos + x2 * sin;

                    ball.vx = vx1 * cos - vy1 * sin;
                    ball.vy = vy1 * cos + vx1 * sin;
                    ball.x = line.x + x1;
                    ball.y = line.y + y1;
                }
            }

            checkBoundaries(ball);

            ball.draw(ctx);
            line.draw(ctx);
        }
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
