import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
interface Props {
    path?: string;
}
interface BallMoveType {
    draw: (angle: number) => void;
    resetPostion: (angle: number) => void;
    stopAnimation: () => void;
}
const BallMove = (canvas: HTMLCanvasElement): BallMoveType => {
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
const input$ = new Subject<React.KeyboardEvent<HTMLInputElement>>();
const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [angle, setAngle] = useState(30);
    const [ballMove, setBallMove] = useState<BallMoveType | null>(null);

    useEffect(() => {
        if (!canvasRef?.current) return;
        const _ballMove = BallMove(canvasRef?.current);
        _ballMove.draw(angle);
        setBallMove(_ballMove);
        const inputOnEnter$ = input$.pipe(filter(e => e.key === 'Enter')).subscribe(e => {
            _ballMove.draw(Number((e.target as HTMLInputElement).value));
        });
        return () => {
            inputOnEnter$.unsubscribe();
        };
    }, []);

    return (
        <>
            <button onClick={() => ballMove && ballMove.draw(angle)}>启动</button>
            <button onClick={() => ballMove && ballMove.stopAnimation()}>暂停</button>
            <button onClick={() => ballMove && ballMove.resetPostion(angle)}>reset</button>
            角度：
            <input
                type="number"
                value={angle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setAngle(Number(e.target.value));
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => input$.next(e)}
            />
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
