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
        const ball = new Ball(30);
        if (!ctx) return;
        let angleX = 0;
        let angleY = 0;
        const range = 50;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const xspeed = 0.07;
        const yspeed = 0.11;
        function draw(): void {
            raf(draw);
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ball.x = centerX + Math.sin(angleX) * range;
            ball.y = centerY + Math.sin(angleY) * range;
            angleX += xspeed;
            angleY += yspeed;
            // ball.y = 400 + Math.sin(angle) * range;

            ball.draw(ctx);
        }
        draw();
    }, []);
    return <canvas ref={canvasRef} width={800} height={700}></canvas>;
};

export default Home;
