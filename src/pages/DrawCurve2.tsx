import React, {useEffect, useRef} from 'react';
import Arrow from '../shape/arrow';
import {captureMouse} from '../utils/index';
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
            const x1 = mouse.x * 2 - (x0 + x2) / 2;
            const y1 = mouse.y * 2 - (y0 + y2) / 2;
            ctx.quadraticCurveTo(x1, y1, x2, y2);
            ctx.stroke();
        });
    }, []);
    return (
        <>
            <p>曲线穿过鼠标 公式： const x1 = mouse.x * 2 - (x0 + x2) / 2; const y1 = mouse.y * 2 - (y0 + y2) / 2; </p>
            <canvas ref={canvasRef} width={800} height={650}></canvas>
        </>
    );
};

export default Home;
