import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import colors from 'nice-color-palettes';
import {convertPosition, containPoint, captureMouse, intersects, getDistance} from '../utils';
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
        const balls: Ball[] = [];
        let cancelAnimationId = 0;
        const gravity = 0.1;
        const spring = 0.015;
        const bounce = -0.5;

        function createBalls() {
            const num = 20;
            for (let i = 0; i < num; i++) {
                const ball = new Ball(20, colors[0][i % 5]);
                ball.x = Math.random() * canvas.width;
                ball.y = (Math.random() * canvas.height) / 2 - 50;
                ball.vx = Math.random() * 6 - 3;
                ball.vy = Math.random() * 6 - 3;
                balls.push(ball);
            }
        }

        function drawBallMove(ball: Ball) {
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
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

        function chceckCollision(ball: Ball, i: number) {
            for (let j = i + 1; j < balls.length; j++) {
                const ballB = balls[j];
                const dx = ballB.x - ball.x;
                const dy = ballB.y - ball.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = ball.radius + ballB.radius;
                if (dist < minDist) {
                    const tx = ball.x + (dx / dist) * minDist;
                    const ty = ball.y + (dx / dist) * minDist;
                    const ay = (ty - ballB.y) * spring;
                    const ax = (tx - ballB.x) * spring;
                    ball.vx -= ax;
                    ball.vy -= ay;
                    ballB.vx += ax;
                    ballB.vy += ay;
                }
            }
        }
        function drawBall(ball: Ball) {
            if (!ctx) return;
            ball.draw(ctx);
        }

        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(drawBallMove);
            balls.forEach(chceckCollision);
            balls.forEach(drawBall);
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
