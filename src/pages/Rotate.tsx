import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import colors from 'nice-color-palettes';
import {convertPosition, containPoint, captureMouse, intersects} from '../utils';
interface Props {
    path?: string;
}

// 坐标旋转
const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let cancelAnimationId = 0;

        const vr = 0.02;
        const cos = Math.cos(vr);
        const sin = Math.sin(vr);

        const mouse = captureMouse(canvas);

        function createBalls(number: number) {
            const balls = [];
            for (let i = 0; i < number; i++) {
                const ball = new Ball(10, colors[0][i % 5]);
                ball.x = Math.random() * canvas.width;
                ball.y = Math.random() * canvas.height;
                balls.push(ball);
            }
            return balls;
        }
        const balls = createBalls(10);
        function rotate(ball: Ball) {
            if (!ctx) return;
            const dx = ball.x - mouse.x;
            const dy = ball.y - mouse.y;
            ball.x = mouse.x + dx * cos - dy * sin;
            ball.y = mouse.y + dy * cos + dx * sin;
            ball.draw(ctx);
        }
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(rotate);
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
