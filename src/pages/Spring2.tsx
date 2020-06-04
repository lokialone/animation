import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {captureMouse} from '../utils';
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
        const ball = new Ball(20);
        ball.x = 100;
        ball.y = 200;
        const mouse = captureMouse(canvas);
        let cancelAnimationId = 0;
        const spring = 0.03;
        const friction = 0.95;
        const gravity = 2;
        const springLength = 50;
        let vx = 0;
        let vy = 0;
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            const dx = ball.x - mouse.x;
            const dy = ball.y - mouse.y;
            const angle = Math.atan2(dy, dx);
            const targetX = mouse.x + Math.cos(angle) * springLength;
            const targetY = mouse.y + Math.sin(angle) * springLength;
            const ax = (targetX - ball.x) * spring;
            const ay = (targetY - ball.y) * spring;
            vx += ax;
            vx *= friction;
            vy += ay;
            vy += gravity;
            vy *= friction;
            ball.x += vx;
            ball.y += vy;
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
            ball.draw(ctx);
        }
        draw();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>小球跟随鼠标弹动</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
