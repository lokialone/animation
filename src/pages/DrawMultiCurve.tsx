import React, {useEffect, useRef} from 'react';

interface Props {
    path?: string;
}
const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    function painit() {
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        const canvas = canvasRef?.current;
        if (!ctx) return;
        const numPoints = 9;
        const ctrlPoint = {x: 0, y: 0};
        const points = new Array(numPoints).fill(0).reduce(acc => {
            acc.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});
            return acc;
        }, []);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < numPoints - 2; i++) {
            ctrlPoint.x = (points[i].x + points[i + 1].x) / 2;
            ctrlPoint.y = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, ctrlPoint.x, ctrlPoint.y);
        }
        ctx.quadraticCurveTo(
            points[numPoints - 2].x,
            points[numPoints - 2].y,
            points[numPoints - 1].x,
            points[numPoints - 1].y,
        );
        ctx.stroke();
    }
    const handleClick = () => {
        painit();
    };
    useEffect(() => {
        painit();
    }, []);
    return (
        <>
            <p>绘制多条曲线 </p>
            <button onClick={handleClick}>重绘 </button>
            <canvas ref={canvasRef} width={800} height={500}></canvas>
        </>
    );
};

export default Home;
