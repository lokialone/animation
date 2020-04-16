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
        const mouse = captureMouse(canvas);
        ball.x = 100;
        ball.y = 100;
        line.x = 50;
        line.y = 200;
        const box = new Box();
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            line.rotation = ((mouse.y - line.y) * 0.1 * Math.PI) / 180;
            const cos = Math.cos(line.rotation);
            const sin = Math.sin(line.rotation);
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            box.x = ball.getBounds().x;
            box.y = ball.getBounds().y;
            if (intersects(ball.getBounds(), line.getBounds())) {
                let x1 = ball.x - line.x;
                let y1 = ball.y - line.y;
                // rotate coordinates
                const x2 = x1 * cos + y1 * sin;
                let y2 = y1 * cos - x1 * sin;
                if (y2 > -ball.radius) {
                    y2 = -ball.radius;
                    // rotate velocity
                    const vx1 = ball.vx * cos + ball.vy * sin;
                    let vy1 = ball.vy * cos - ball.vx * sin;
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
