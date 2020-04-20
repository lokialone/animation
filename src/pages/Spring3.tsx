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
        let ballNumbers = 10;
        const balls: Ball[] = [];
        while (ballNumbers--) {
            balls.push(new Ball(10, 'black'));
        }
        const mouse = captureMouse(canvas);
        let cancelAnimationId = 0;
        const spring = 0.01;
        const friction = 0.9;
        const gravity = 0.4;

        function springMove(ball: Ball, targetX: number, targetY: number) {
            ball.vx += (targetX - ball.x) * spring;
            ball.vy += (targetY - ball.y) * spring;
            ball.vy += gravity;
            ball.vx *= friction;
            ball.vy *= friction;
            ball.x += ball.vx;
            ball.y += ball.vy;
        }
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            ctx.beginPath();
            balls.forEach((item: Ball, index: number) => {
                if (index === 0) {
                    springMove(item, mouse.x, mouse.y);
                    ctx.moveTo(mouse.x, mouse.y);
                } else {
                    const beforeBall = balls[index - 1];
                    ctx.moveTo(beforeBall.x, beforeBall.y);
                    springMove(item, beforeBall.x, beforeBall.y);
                }
                ctx.lineTo(item.x, item.y);
                ctx.stroke();
                item.draw(ctx);
            });
            ctx.closePath();
        }
        draw();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>跟随鼠标弹动</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
