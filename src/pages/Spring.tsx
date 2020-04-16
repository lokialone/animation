import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {fromEvent} from 'rxjs';
import {filter, mergeMap, takeUntil, map, tap} from 'rxjs/operators';
import {convertPosition, containPoint, captureMouse, getDirect, getDistance} from '../utils';
import {Position} from '../types';
interface Props {
    path?: string;
}

const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const ball = new Ball(20);
        const fixedX = canvas.width / 2;
        const fixedY = 200;
        ball.x = 100;
        ball.y = 200;
        const center = new Ball(10);
        center.x = fixedX;
        center.y = fixedY;

        let cancelAnimationId = 0;
        const mouseDown$ = fromEvent(canvas, 'mousedown');
        const mouseMove$ = fromEvent(window, 'mousemove');
        const mouseUp$ = fromEvent(window, 'mouseup');
        const spring = 0.03;
        const friction = 0.95;
        const springLength = 100;
        // let vx = getDirect(targetX, ball.x);
        // let vy = getDirect(targetY, ball.y);
        let vx = 0;
        let vy = 0;
        let isMouseDown = false;
        const drag$ = mouseDown$
            .pipe(
                filter((event: any) => {
                    const {x, y} = convertPosition(event, canvas);
                    return containPoint(ball.getBounds(), x, y);
                }),
                tap(() => {
                    isMouseDown = true;
                }),
                map((event: any) => {
                    const {x, y} = convertPosition(event, canvas);
                    return {x: x - ball.x, y: y - ball.y, oldX: x, oldY: y};
                }),
                mergeMap(offset =>
                    mouseMove$.pipe(
                        map((event: any) => {
                            const {x, y} = convertPosition(event, canvas);
                            return {x: x - offset.x, y: y - offset.y, oldX: offset.oldX, oldY: offset.oldY};
                        }),
                        takeUntil(
                            mouseUp$.pipe(
                                tap(() => {
                                    isMouseDown = false;
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(({x, y, oldX, oldY}) => {
                ball.x = x;
                ball.y = y;
            });
        function drawSpring(from: Position, to: Position, space = 6, height = 50) {
            if (!ctx) return;
            ctx.save();
            ctx.beginPath();
            const ball = new Ball(10);
            ball.x = from.x;
            ball.y = from.y;
            ball.draw(ctx);

            const angle = Math.atan2(to.y - from.y, to.x - from.x);
            ctx.rotate(angle);
            // ctx.moveTo(0, 0);
            for (let i = from.x; i <= to.x; i++) {
                const y = Math.sin(i / 5) * 100 - 50;
                ctx.lineTo(i, y);
            }

            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        // function drawSpring(from: Position, to: Position, space = 6, height = 50) {
        //
        //     const lineWidth = 20;
        //     const tx = to.x - from.x;
        //     const ty = to.y - from.y;
        //     const angle = Math.atan2(ty, tx);
        //     const dx = (tx - lineWidth) / (space * 2);
        //     ctx.beginPath();
        //     ctx.moveTo(from.x, from.y);
        //     const startX = (lineWidth / 2) * Math.cos(angle) + from.x;
        //     const startY = from.y + (lineWidth / 2) * Math.sin(angle);
        //     ctx.lineTo(startX, startY);
        //     let yDirect = 1;
        //     for (let i = 1; i < space * 2; i++) {
        //         const currnetx = startX + dx * (i - 1) * Math.cos(angle);
        //         const currenty = startY + dx * (i - 1) * Math.sin(angle);
        //         const nextx = startX + dx * i * Math.cos(angle);
        //         const nexty = startY + dx * i * Math.sin(angle);
        //         const ctrx = (currnetx + nextx) / 2;
        //         const ctry = ((currenty + nexty) / 2) * yDirect;
        //         yDirect = -1 * yDirect;
        //         ctx.quadraticCurveTo(ctrx, ctry, nextx, nexty);
        //     }
        //     ctx.lineTo(to.x, to.y);
        //     ctx.stroke();
        //     ctx.closePath();
        // }

        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            if (getDistance(ball.x, ball.y, fixedX, fixedY) > 0.001 && !isMouseDown) {
                const dx = ball.x - fixedX;
                const dy = ball.y - fixedY;
                const angle = Math.atan2(dy, dx);
                const targetX = fixedX + Math.cos(angle) * springLength;
                const targetY = fixedY + Math.sin(angle) * springLength;
                const ax = (targetX - ball.x) * spring;
                const ay = (targetY - ball.y) * spring;
                vx += ax;
                vx *= friction;
                vy += ay;
                vy *= friction;
                ball.x += vx;
                ball.y += vy;
            }

            center.draw(ctx);
            ball.draw(ctx);
            ctx.beginPath();
            ctx.moveTo(100, 400);
        }
        // draw();
        drawSpring({x: 200, y: 200}, {x: 600, y: 600});

        return () => {
            drag$.unsubscribe();
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>小球可拖拽</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
