import React, {useEffect, useRef, useState, useCallback} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
interface Props {
    path?: string;
}

const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ball = useRef<Ball>(new Ball(30)).current;
    const subject$ = useRef(new Subject()).current;
    const cancelAnimation = useRef<number>(0);
    const [angle, setAngle] = useState(30);
    const [speed] = useState(1);
    console.log('every', angle);

    const draw = () => {
        cancelAnimationFrame(cancelAnimation.current);
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        const canvas = canvasRef?.current;
        if (!ctx) return;
        const radians = (angle * Math.PI) / 180;
        console.log('draw', angle);
        function _draw(): void {
            if (!ctx) return;
            cancelAnimation.current = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const vx = speed * Math.cos(radians);
            const vy = speed * Math.sin(radians);
            ball.x += vx;
            ball.y += vy;
            ball.draw(ctx);
        }
        _draw();
    };
    const reDraw = () => {
        ball.x = 0;
        ball.y = 0;
        console.log('redraw', angle);
        cancelAnimationFrame(cancelAnimation.current);
        draw();
    };

    const pause = useCallback(() => {
        cancelAnimationFrame(cancelAnimation.current);
    }, []);
    useEffect(() => {
        draw();
        subject$.pipe(filter((e: any) => e.key === 'Enter')).subscribe(() => {
            reDraw();
        });
    }, []);

    return (
        <>
            <button onClick={draw}>启动</button>
            <button onClick={pause}>暂停</button>
            {/* <button onClick={}>reset</button> */}
            角度：
            <input
                type="number"
                value={angle}
                onChange={(e: any) => {
                    if (e.target) {
                        setAngle(e.target.value);
                    }
                }}
                onKeyPress={(e: any) => subject$.next(e)}
            />
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default Home;
