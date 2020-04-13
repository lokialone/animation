import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject, fromEvent, Observable} from 'rxjs';
import {filter, mergeMap, takeUntil, map, tap} from 'rxjs/operators';
import {convertPosition, containPoint, captureMouse, getDirect, getDistance} from '../utils';
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
        let cancelAnimationId = 0;
        const handles: Ball[] = [];
        const numberOfHandles = 3;
        const mouse = captureMouse(canvas);
        let movingHandle: Ball | null = null;
        const spring = 0.03;
        const friction = 0.95;
        for (let i = 0; i < numberOfHandles; i++) {
            const handle = new Ball(10, '#0000ff');
            handle.x = Math.random() * canvas.width;
            handle.y = Math.random() * canvas.height;
            handles.push(handle);
        }
        canvas.addEventListener('mousedown', () => {
            handles.forEach(handle => {
                if (containPoint(handle.getBounds(), mouse.x, mouse.y)) {
                    movingHandle = handle;
                }
            });
        });
        window.addEventListener('mouseup', () => {
            movingHandle = null;
        });
        canvas.addEventListener('mousemove', () => {
            if (movingHandle) {
                movingHandle.x = mouse.x;
                movingHandle.y = mouse.y;
            }
        });

        function applyHandle(handle: Ball) {
            const dx = handle.x - ball.x,
                dy = handle.y - ball.y;
            ball.vx += dx * spring;
            ball.vy += dy * spring;
        }

        function drawHandle(handle: Ball) {
            if (!ctx) return;
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(handle.x, handle.y);
            ctx.stroke();
            handle.draw(ctx);
        }
        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handles.forEach(applyHandle);
            ball.vx *= friction;
            ball.vy *= friction;
            ball.x += ball.vx;
            ball.y += ball.vy;
            ctx.beginPath();
            handles.forEach(drawHandle);
            ball.draw(ctx);
        }
        drawFrame();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>蓝色小球可拖拽</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
