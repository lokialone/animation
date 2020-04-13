import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject, fromEvent, Observable} from 'rxjs';
import {filter, mergeMap, takeUntil, map, tap} from 'rxjs/operators';
import {convertPosition, containPoint} from '../utils';
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
        const bounce = -0.7;
        const gravity = 0.2;
        const friction = 0.97;
        let isMouseDown = false;
        ball.vx = Math.random() * 4 - 2;
        ball.vy = 5;
        function checkBoundaries() {
            const left = 0,
                right = canvas.width,
                top = 0,
                bottom = canvas.height;

            ball.vy += gravity;
            ball.vx *= friction;
            ball.vy *= friction;
            ball.x += ball.vx;
            ball.y += ball.vy;
            //boundary detect and bounce
            if (ball.x + ball.radius > right) {
                ball.x = right - ball.radius;
                ball.vx *= bounce;
            } else if (ball.x - ball.radius < left) {
                ball.x = left + ball.radius;
                ball.vx *= bounce;
            }
            if (ball.y + ball.radius > bottom) {
                ball.y = bottom - ball.radius;
                ball.vy *= bounce;
            } else if (ball.y - ball.radius < top) {
                ball.y = top + ball.radius;
                ball.vy *= bounce;
            }
        }
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
                ball.vx = (x - oldX) * 0.1;
                ball.vy = 0;
                // ball.vy = (y - oldY) * 0.1;
            });
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationId = raf(draw);
            if (isMouseDown) {
            } else {
                checkBoundaries();
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
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
