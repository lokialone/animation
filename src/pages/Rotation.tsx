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
        if (!ctx) return;
        // arrow.draw(ctx);
        const mouse = captureMouse(canvas);
        const yspeed = 0.05;
        const xspeed = 1;
        const range = 40;
        let angle = 0;
        const centerScale = 1;
        const rangeScale = 0.2;
        function draw(): void {
            raf(draw);
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dx = mouse.x - arrow.x;
            const dy = mouse.y - arrow.y;
            arrow.rotation = Math.atan2(dy, dx);
            // ball.x += xspeed;
            // ball.y = 400 + Math.sin(angle) * range;
            ball.scaleX = ball.scaleY = centerScale + Math.sin(angle) * rangeScale;
            angle += yspeed;
            arrow.draw(ctx);
            ball.draw(ctx);
        }
        draw();
    }, []);
    return <canvas ref={canvasRef} width={800} height={600}></canvas>;
};

export default Home;
