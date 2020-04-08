import React, {useEffect, useRef} from 'react';
import Arrow from '../shape/arrow';
import {captureMouse} from '../utils/index';
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
        const arrow = new Arrow(80, 50);
        const ball = new Ball(30);
        ball.x = 400;
        ball.y = 400;
        if (!ctx) return;
        // arrow.draw(ctx);
        const mouse = captureMouse(canvas);
        let yspeed = 0.05;
        let vx = 0;
        let vy = 0;
        const force = 0.05;
        let ballAngle = 0;
        const centerScale = 1;
        const rangeScale = 0.2;
        let cancelAnimationId = 0;
        function draw(): void {
            cancelAnimationId = raf(draw);
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dx = mouse.x - arrow.x;
            const dy = mouse.y - arrow.y;
            const angle = Math.atan2(dy, dx);
            arrow.rotation = angle;
            const ax = Math.cos(angle) * force;
            const ay = Math.sin(angle) * force;
            vx += ax;
            vy += ay;
            arrow.x += vx;
            arrow.y += vy;
            // arrow.x += Math.cos(angle) * 3;
            // arrow.y += Math.sin(angle) * 3;
            // ball.y = 400 + Math.sin(angle) * range;
            ball.scaleX = ball.scaleY = centerScale + Math.sin(ballAngle) * rangeScale;
            ballAngle += 0.1;
            // ball.x += 2;
            // ball.y += yspeed;
            yspeed += 0.02;
            arrow.draw(ctx);
            ball.draw(ctx);
        }
        draw();
        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);
    return <canvas ref={canvasRef} width={800} height={600}></canvas>;
};

export default Home;
