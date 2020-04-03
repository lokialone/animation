import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
interface Props {
    path?: string;
}
const BallMove = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    const ball = new Ball(30);
    ball.x = 100;
    ball.y = 100;
    let cancelAnimationId: number | null = null;
    const speed = 0.5;
    function draw(angle: number): void {
        if (cancelAnimationId) cancelAnimationFrame(cancelAnimationId);
        const radians = (angle * Math.PI) / 180;
        function _draw(): void {
            if (!ctx) return;
            cancelAnimationId = raf(() => draw(angle));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const vx = speed * Math.cos(radians);
            const vy = speed * Math.sin(radians);
            ball.x += vx;
            ball.y += vy;
            ball.draw(ctx);
        }
        _draw();
    }
    function resetPostion(angle: number): void {
        ball.x = 100;
        ball.y = 100;
        draw(angle);
    }
    function stopAnimation(): void {
        if (cancelAnimationId) cancelAnimationFrame(cancelAnimationId);
    }
    return {draw, resetPostion, stopAnimation};
};
const input$ = new Subject();
const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [angle, setAngle] = useState(30);
    const [ballMove, setBallMove] = useState<any>(null);

    useEffect(() => {
        if (!canvasRef?.current) return;
        const _ballMove = BallMove(canvasRef?.current);
        _ballMove.draw(angle);
        setBallMove(_ballMove);
        const inputOnEnter$ = input$.pipe(filter((e: any) => e.key === 'Enter')).subscribe(e => {
            _ballMove.draw(e.target.value);
        });
        return () => {
            inputOnEnter$.unsubscribe();
        };
    }, []);

    return (
        <>
            <button onClick={() => ballMove.draw(angle)}>启动</button>
            <button onClick={() => ballMove.stopAnimation()}>暂停</button>
            <button onClick={() => ballMove.resetPostion(angle)}>reset</button>
            角度：
            <input
                type="number"
                value={angle}
                onChange={(e: any) => {
                    setAngle(e.target.value);
                }}
                onKeyPress={(e: any) => input$.next(e)}
            />
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
