import React, {useEffect, useRef} from 'react';
// import Arrow from '../shape/arrow';
// import {captureMouse} from '../utils/index';
// import raf from 'raf';
// import {fromEvent} from 'rxjs';
interface Props {
    path?: string;
}
const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        // const canvas = canvasRef?.current;
        const p1 = {x: 0, y: 0};
        const p2 = {x: 100, y: 100};
        if (!ctx) return;
        ctx.save();
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#0000ff');
        gradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillRect(100, 100, 100, 100);
        ctx.restore();

        const circleGradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 50);
        circleGradient.addColorStop(0, '#000000');
        circleGradient.addColorStop(1, '#0000ff');
        ctx.fillStyle = circleGradient;
        ctx.arc(200, 200, 50, 0, Math.PI * 2, true);
        ctx.fill();
    }, []);
    return (
        <>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default Home;
