import React, {useEffect, useRef} from 'react';
import Arrow from '../shape/arrow';
import {captureMouse} from '../utils/index';
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
        const ballNumbers = 180;
        const gravity = 0.5;
        for (let i = 0; i < ballNumbers; i++) {
            const ball = new Ball(4, colors[0][i % 5]);
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.vx = Math.random() * 6 - 3;
            ball.vy = Math.random() * -10 - 10;
            balls.push(ball);
        }
        function draw(ball: Ball): void {
            if (!ctx) return;
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            if (
                ball.x - ball.radius > canvas.width ||
                ball.x + ball.radius < 0 ||
                ball.y - ball.radius > canvas.height ||
                ball.y + ball.radius < 0
            ) {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
                ball.vx = Math.random() * 6 - 3;
                ball.vy = Math.random() * -10 - 10;
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
            <canvas ref={canvasRef} width={800} height={650}></canvas>
        </>
    );
};

export default Home;
