import React, {useEffect, useRef} from 'react';
import Arrow from '../shape/arrow';
import {captureMouse} from '../utils/index';
import raf from 'raf';
import {fromEvent} from 'rxjs';
interface Props {
    path?: string;
}
const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        const canvas = canvasRef?.current;
        const canvasMouseMove = fromEvent(canvas, 'mousemove');
        const mouse = captureMouse(canvas);
        const x0 = 100;
        const y0 = 200;
        const x2 = 500;
        const y2 = 200;
        if (!ctx) return;
        canvasMouseMove.subscribe(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.quadraticCurveTo(mouse.x, mouse.y, x2, y2);
            ctx.stroke();
        });
    }, []);
    return (
        <>
            <p>鼠标为弧形控制点</p>
            <canvas ref={canvasRef} width={800} height={650}></canvas>
        </>
    );
};

export default Home;
