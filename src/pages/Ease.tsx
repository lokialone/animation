import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject, fromEvent, Observable} from 'rxjs';
import {filter, mergeMap, takeUntil, map, tap} from 'rxjs/operators';
import {convertPosition, containPoint, captureMouse} from '../utils';
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
        ball.x = 100;
        ball.y = 200;
        let cancelAnimationId = 0;
        const mouseDown$ = fromEvent(canvas, 'mousedown');
        const mouseMove$ = fromEvent(window, 'mousemove');
        const mouseUp$ = fromEvent(window, 'mouseup');
        const ease = 0.02;
        let isMouseDown = false;
        const targetX = canvas.width - 100;
        const targetY = 200;
        const mouse = captureMouse(canvas);
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
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            if (!isMouseDown) {
                ball.x += (mouse.x - ball.x) * ease;
                ball.y += (mouse.y - ball.y) * ease;
            }
            ball.draw(ctx);
        }
        draw();

        return () => {
            drag$.unsubscribe();
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>小球跟随鼠标缓动</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
