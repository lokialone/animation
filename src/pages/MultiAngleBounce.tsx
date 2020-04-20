import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import Line from '../shape/line';
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
        const ball = new Ball(20);
        const lines: Line[] = [];
        const gravity = 0.2;
        const bounce = -0.6;
        const friction = 1;

        ball.x = 100;
        ball.y = 50;

        //create 5 lines, position and rotate
        lines[0] = new Line(-50, 0, 50, 0);
        lines[0].x = 100;
        lines[0].y = 100;
        lines[0].rotation = (30 * Math.PI) / 180;

        lines[1] = new Line(-50, 0, 50, 0);
        lines[1].x = 100;
        lines[1].y = 200;
        lines[1].rotation = (45 * Math.PI) / 180;

        lines[2] = new Line(-50, 0, 50, 0);
        lines[2].x = 220;
        lines[2].y = 150;
        lines[2].rotation = (-20 * Math.PI) / 180;

        lines[3] = new Line(-50, 0, 50, 0);
        lines[3].x = 150;
        lines[3].y = 330;
        lines[3].rotation = (10 * Math.PI) / 180;

        lines[4] = new Line(-50, 0, 50, 0);
        lines[4].x = 230;
        lines[4].y = 250;
        lines[4].rotation = (-30 * Math.PI) / 180;

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

        function checkLine(line: Line) {
            const bounds = line.getBounds();

            if (ball.x + ball.radius > bounds.x && ball.x - ball.radius < bounds.x + bounds.width) {
                //get angle, sine, and cosine
                const cos = Math.cos(line.rotation);
                const sin = Math.sin(line.rotation);
                //get position of ball, relative to line
                let x1 = ball.x - line.x;
                let y1 = ball.y - line.y;
                //rotate coordinates
                let y2 = cos * y1 - sin * x1;
                //rotate velocity
                let vy1 = cos * ball.vy - sin * ball.vx;
                //perform bounce with rotated values
                if (y2 > -ball.radius && y2 < vy1) {
                    //rotate coordinates
                    const x2 = cos * x1 + sin * y1;
                    //rotate velocity
                    const vx1 = cos * ball.vx + sin * ball.vy;
                    y2 = -ball.radius;
                    vy1 *= bounce;
                    //rotate everything back
                    x1 = cos * x2 - sin * y2;
                    y1 = cos * y2 + sin * x2;
                    ball.vx = cos * vx1 - sin * vy1;
                    ball.vy = cos * vy1 + sin * vx1;
                    ball.x = line.x + x1;
                    ball.y = line.y + y1;
                }
            }
        }
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            checkBoundaries(ball);

            ball.draw(ctx);
            lines.forEach(line => line.draw(ctx));
            lines.forEach(checkLine);
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
